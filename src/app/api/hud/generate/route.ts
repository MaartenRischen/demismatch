import { NextRequest, NextResponse } from 'next/server';

// Generate HUD overlay using Gemini 3 Pro Image
// Takes the Claude analysis and renders a beautiful HUD overlay

export async function POST(request: NextRequest) {
  try {
    const { image, analysis } = await request.json();

    if (!image || !analysis) {
      return NextResponse.json({ error: 'Image and analysis are required' }, { status: 400 });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return NextResponse.json({ error: 'Missing OPENROUTER_API_KEY' }, { status: 500 });
    }

    // Extract base64 and handle format conversion if needed
    const imageMatch = image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!imageMatch) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
    }
    
    let mimeType = imageMatch[1];
    let base64Data = imageMatch[2];
    
    // Convert unsupported formats to PNG
    const supportedFormats = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
    if (!supportedFormats.includes(mimeType.toLowerCase())) {
      try {
        const sharp = (await import('sharp')).default;
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const pngBuffer = await sharp(imageBuffer).png().toBuffer();
        base64Data = pngBuffer.toString('base64');
        mimeType = 'png';
      } catch (e) {
        console.error('[HUD Generate] Format conversion failed:', e);
      }
    }

    // Build the visual prompt based on analysis
    const visualPrompt = buildHUDPrompt(analysis);
    
    console.log('[HUD Generate] Calling Gemini...', { 
      analysisType: analysis.scene_type,
      isMismatch: analysis.is_mismatch 
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://demismatch.com',
        'X-Title': 'Demismatch HUD'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: `data:image/${mimeType};base64,${base64Data}` }
              },
              {
                type: 'text',
                text: visualPrompt
              }
            ]
          }
        ],
        // CRITICAL: Request image output
        modalities: ['image', 'text']
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[HUD Generate] OpenRouter error:', errorText);
      return NextResponse.json({ error: 'Generation failed', details: errorText }, { status: 500 });
    }

    const data = await response.json();
    
    // Log response structure for debugging
    const message = data.choices?.[0]?.message;
    console.log('[HUD Generate] Response structure:', {
      hasImages: !!message?.images,
      imagesCount: message?.images?.length,
      hasContent: !!message?.content,
      contentType: typeof message?.content,
      contentIsArray: Array.isArray(message?.content)
    });

    let imageUrl: string | null = null;

    // Check message.images array (OpenRouter documented format)
    if (message?.images && Array.isArray(message.images) && message.images.length > 0) {
      const firstImage = message.images[0];
      imageUrl = firstImage?.image_url?.url || firstImage?.url || firstImage;
      console.log('[HUD Generate] Found image in images array');
    }

    // Fallback: Check content array for image parts
    if (!imageUrl && message?.content && Array.isArray(message.content)) {
      for (const part of message.content) {
        if (part.type === 'image_url' && part.image_url?.url) {
          imageUrl = part.image_url.url;
          break;
        }
        if (part.type === 'image' && part.source?.data) {
          imageUrl = `data:${part.source.media_type || 'image/png'};base64,${part.source.data}`;
          break;
        }
        if (part.inline_data?.data) {
          imageUrl = `data:${part.inline_data.mime_type || 'image/png'};base64,${part.inline_data.data}`;
          break;
        }
      }
    }

    // Fallback: Check data array
    if (!imageUrl && data.data?.[0]?.b64_json) {
      imageUrl = `data:image/png;base64,${data.data[0].b64_json}`;
    }

    if (imageUrl) {
      console.log('[HUD Generate] Success! Returning image');
      return NextResponse.json({ image: imageUrl });
    }

    // No image found
    console.error('[HUD Generate] No image in response:', JSON.stringify(data, null, 2).substring(0, 1500));
    return NextResponse.json({
      error: 'No image generated',
      hint: 'Gemini returned text but no image. Try again.',
      reasoning: message?.reasoning?.substring(0, 500) || message?.content?.substring?.(0, 500)
    }, { status: 500 });

  } catch (error) {
    console.error('[HUD Generate] Error:', error);
    return NextResponse.json({ error: 'Generation failed', details: String(error) }, { status: 500 });
  }
}

function buildHUDPrompt(analysis: Record<string, unknown>): string {
  const isRed = analysis.overall_color_scheme === 'red' || analysis.is_mismatch;
  
  // Build biometrics
  const biometrics = analysis.biometrics as Record<string, { level: string; score: number }> | undefined;
  const bioLines = Object.entries(biometrics || {})
    .slice(0, 6) // Max 6 biometrics
    .map(([key, val]) => `${key.toUpperCase()}: ${val.level}`)
    .join('\n');

  // Build status panel
  const status = analysis.status_panel as Record<string, { level: string; detail: string }> | undefined;
  const statusLines = Object.entries(status || {})
    .map(([key, val]) => `${key.replace(/_/g, ' ').toUpperCase()}: ${val.level}`)
    .join('\n');

  // Primary target
  const target = analysis.primary_target as { label?: string; analysis?: string; what?: string } | undefined;
  
  // People/subjects
  const people = analysis.people as Array<{ description: string; label: string; position: string }> | undefined;
  const peopleLines = (people || [])
    .map(p => `- ${p.description}: "${p.label}" at ${p.position}`)
    .join('\n');

  // Action
  const action = analysis.action as { recommendation?: string; urgency?: string } | undefined;
  
  // Mismatch
  const mismatchDetails = analysis.mismatch_details as string | undefined;

  const colorScheme = isRed 
    ? `Use a RED/AMBER color scheme indicating threat/mismatch:
- Red tint overlay on the entire scene
- Red/orange panels with glowing edges
- Red targeting reticle
- Warning indicators`
    : `Use a GREEN/TEAL color scheme indicating positive fitness:
- Subtle green tint on the scene  
- Dark panels with green/cyan glowing edges
- Golden/green targeting reticle
- Positive indicators`;

  return `Edit this image to add a professional sci-fi "Evolutionary HUD" overlay. Make it look like a video game or fighter jet cockpit display showing evolutionary fitness computations.

STYLE: High-quality, polished HUD overlay. Semi-transparent dark panels with glowing edges. Clean sans-serif typography. Professional targeting graphics.

${colorScheme}

=== LEFT PANEL (top-left, semi-transparent dark background) ===
BIOMETRICS with horizontal bar graphs:
${bioLines || 'DOPAMINE: HIGH\nSEROTONIN: MODERATE\nOXYTOCIN: HIGH\nCORTISOL: LOW'}

Each metric should have a label and a horizontal progress bar showing the level.

=== RIGHT PANEL (top-right, semi-transparent dark background) ===
STATUS READOUTS:
${statusLines || 'RESOURCE: HIGH\nTHREAT: ZERO\nTRIBE STATUS: COHESIVE'}

=== PRIMARY TARGET (center of image) ===
Place a ${isRed ? 'red/orange' : 'golden'} targeting reticle (circular crosshairs) on: ${target?.what || 'the main subject'}
Label: "${target?.label || 'PRIMARY TARGET'}"
Below: "ANALYSIS: ${target?.analysis || 'EVALUATING'}"

=== SECONDARY TARGETS ===
${peopleLines || 'Draw smaller targeting brackets on other people/animals with bond status labels'}

=== CONNECTION LINES ===
Draw ${isRed ? 'red' : 'green'} glowing lines connecting bonded subjects. Add "KIN-LIKE BOND: SECURE" or similar labels.

${action?.urgency === 'HIGH' || action?.urgency === 'CRITICAL' ? `
=== ACTION INDICATOR ===
Large prominent text: "ACTION: ${action?.recommendation}" in ${isRed ? 'red' : 'green'}
` : ''}

${analysis.is_mismatch ? `
=== MISMATCH WARNING ===
Add subtle red vignette. Bottom warning bar: "⚠ ENVIRONMENTAL MISMATCH: ${mismatchDetails?.substring(0, 80) || 'Modern environment detected'}"
` : ''}

REQUIREMENTS:
- Keep the original image fully visible
- All panels should be semi-transparent (dark background ~75% opacity)
- Use glowing edges on panels (subtle cyan/green or red glow)
- Clean, readable sans-serif font
- Horizontal bar graphs for biometrics (not circular)
- Professional video game / cockpit HUD aesthetic
- Add subtle scan lines or tech texture for authenticity

Generate the edited image with all HUD elements applied.`;
}

