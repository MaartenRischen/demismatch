import { NextRequest, NextResponse } from 'next/server';

// Generate HUD overlay using Gemini 3 Pro Image
// Takes the Claude analysis and renders a beautiful HUD overlay

export async function POST(request: NextRequest) {
  try {
    const { image, analysis, viewer_profile } = await request.json();

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

    // Build the visual prompt based on analysis + viewer POV
    const visualPrompt = buildHUDPrompt(analysis, viewer_profile);
    
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

function buildHUDPrompt(analysis: Record<string, unknown>, viewer_profile?: Record<string, unknown>): string {
  const isRed = analysis.overall_color_scheme === 'red' || analysis.is_mismatch;
  
  // Primary target
  const target = analysis.primary_target as { what?: string; importance_score?: number } | undefined;
  
  // People/subjects
  const people = analysis.people as Array<{ description: string; position: string; bond_status: string }> | undefined;
  
  // Detected items
  const items = analysis.detected_items as Array<{ class: string; position: string; importance_score: number; color: string }> | undefined;
  
  // Sort items by importance
  const sortedItems = [...(items || [])].sort((a, b) => (b.importance_score || 0) - (a.importance_score || 0));
  const topItems = sortedItems.slice(0, 5);

  const colorScheme = isRed 
    ? `RED/AMBER color scheme (threat/mismatch detected):
- Subtle red/amber tint on entire scene
- Red glowing outlines on threats
- Orange outlines on uncertain items
- Dark vignette effect`
    : `GREEN/TEAL color scheme (positive fitness environment):
- Subtle green/teal tint on scene
- Green glowing outlines on resources/allies
- Golden outlines on opportunities
- Warm, safe feeling`;

  const viewerPOV = viewer_profile
    ? `\n\nVIEWER POV (user-provided): ${JSON.stringify(viewer_profile)}\nMake the overlay consistent with THIS viewer's incentives (threat vs mate vs kin vs coalition vs resource).`
    : `\n\nVIEWER POV: No settings provided. Use a species-average adult observer POV.`;

  return `Edit this image to add a VISUAL-ONLY evolutionary fitness overlay. NO TEXT AT ALL - only colors, outlines, and visual effects.

CRITICAL: DO NOT ADD ANY TEXT, LABELS, WORDS, OR NUMBERS. Only visual elements.

${colorScheme}
${viewerPOV}

=== VISUAL OVERLAY STYLE ===
This should look like thermal/predator vision mixed with a fitness detection system. Think: what would a hunter-gatherer's brain highlight as important?

=== PRIMARY FOCUS (most important for survival/reproduction) ===
Draw a bright, glowing outline around: ${target?.what || 'the main subject'}
- Use a thick (4-6px), pulsing/glowing ${isRed ? 'red/orange' : 'golden/green'} outline
- Add a subtle spotlight/vignette effect drawing attention to this area
- This is the most fitness-relevant element in the scene

=== SECONDARY ELEMENTS ===
${topItems.map(item => `- ${item.class} at ${item.position}: ${item.color} outline (${item.importance_score}% important)`).join('\n') || 'Outline other relevant items with colored borders based on their fitness relevance'}

=== PEOPLE/ANIMALS ===
${(people || []).map(p => {
  const color = p.bond_status === 'KIN' || p.bond_status === 'ALLY' ? 'green' :
                p.bond_status === 'THREAT' ? 'red' :
                p.bond_status === 'POTENTIAL_MATE' ? 'pink/magenta' : 'yellow';
  return `- ${p.description} at ${p.position}: ${color} glow (${p.bond_status})`;
}).join('\n') || 'Color-code any people/animals based on bond status'}

=== CONNECTION LINES ===
Draw subtle glowing lines between bonded individuals:
- Green lines = allied/kin bonds
- Red lines = threat/competition
- Pink/magenta = attraction/mate potential

=== EMOTIONAL ATMOSPHERE ===
Apply a color grade to the entire image:
${isRed ? '- Desaturate slightly, add red/amber tint to shadows\n- Increase contrast for alertness feeling\n- Darker vignette at edges' : '- Warm, slightly saturated\n- Green/teal tint in highlights\n- Soft, safe feeling\n- Gentle vignette'}

=== DEPTH/IMPORTANCE GRADIENT ===
- More important = brighter outline, more saturated
- Less important = dimmer, more transparent outline
- Background elements = very subtle or no outline

REQUIREMENTS:
- NO TEXT, NO LABELS, NO WORDS, NO NUMBERS
- Keep original image clearly visible (overlay should be ~30-40% opacity)
- Outlines should glow/pulse subtly
- Use color psychology: green=safe, red=danger, yellow=caution, pink=attraction
- Professional, cinematic look
- Subtle scan lines or film grain for texture

Generate the edited image with visual-only overlay.`;
}

