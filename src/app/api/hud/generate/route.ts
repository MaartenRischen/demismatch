import { NextRequest, NextResponse } from 'next/server';

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
    
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    
    // Build detailed visual prompt from analysis
    const visualPrompt = buildVisualPrompt(analysis);
    
    console.log('[HUD Generate] Starting image generation...');
    console.log('[HUD Generate] Request:', JSON.stringify({
      model: 'google/gemini-2.5-flash-image-preview',
      modalities: ['image', 'text'],
      hasImage: true,
      promptLength: visualPrompt.length,
      messageCount: 1
    }));
    
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
                image_url: { url: `data:image/jpeg;base64,${base64Data}` }
              },
              {
                type: 'text', 
                text: visualPrompt
              }
            ]
          }
        ],
        // CRITICAL: This tells OpenRouter to return image output!
        modalities: ['image', 'text']
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[HUD Generate] OpenRouter error:', errorText);
      return NextResponse.json({ error: 'Generation failed', details: errorText }, { status: 500 });
    }

    const data = await response.json();
    
    console.log('[HUD Generate] Response:', JSON.stringify({
      hasChoices: !!data.choices,
      choiceCount: data.choices?.length,
      hasContent: !!data.choices?.[0]?.message?.content,
      hasImages: !!data.choices?.[0]?.message?.images,
      imagesCount: data.choices?.[0]?.message?.images?.length,
      hasReasoning: !!data.choices?.[0]?.message?.reasoning,
      contentType: typeof data.choices?.[0]?.message?.content,
      isArray: Array.isArray(data.choices?.[0]?.message?.content),
      finishReason: data.choices?.[0]?.finish_reason,
      rawContent: data.choices?.[0]?.message?.content?.substring?.(0, 100) || null
    }));
    
    const message = data.choices?.[0]?.message;
    let imageUrl: string | null = null;
    
    // Primary format: OpenRouter's images array (documented format)
    if (message?.images && Array.isArray(message.images) && message.images.length > 0) {
      const firstImage = message.images[0];
      imageUrl = firstImage?.image_url?.url || firstImage?.url || firstImage;
      console.log('[HUD Generate] Found images array format');
    }
    
    // Fallback: Check if content is an array with image parts
    if (!imageUrl && message?.content && Array.isArray(message.content)) {
      for (const part of message.content) {
        if (part.type === 'image_url' && part.image_url?.url) {
          imageUrl = part.image_url.url;
          console.log('[HUD Generate] Found image_url in content array');
          break;
        }
        if (part.type === 'image' && part.source?.data) {
          imageUrl = `data:${part.source.media_type || 'image/png'};base64,${part.source.data}`;
          console.log('[HUD Generate] Found image source format');
          break;
        }
        if (part.inline_data?.data) {
          imageUrl = `data:${part.inline_data.mime_type || 'image/png'};base64,${part.inline_data.data}`;
          console.log('[HUD Generate] Found inline_data format');
          break;
        }
      }
    }
    
    // Fallback: Check data array format (some models use this)
    if (!imageUrl && data.data?.[0]?.b64_json) {
      imageUrl = `data:image/png;base64,${data.data[0].b64_json}`;
      console.log('[HUD Generate] Found data.b64_json format');
    }

    if (imageUrl) {
      console.log('[HUD Generate] Success! Image URL length:', imageUrl.length);
      return NextResponse.json({ image: imageUrl });
    }
    
    // No image found - log full structure for debugging
    console.error('[HUD Generate] No image found in response. Full response structure:', JSON.stringify(data, null, 2));
    
    return NextResponse.json({ 
      error: 'No image generated - check server logs for response structure',
      hint: 'The model returned reasoning but no image. This might be a model limitation.',
      analysis: analysis
    }, { status: 500 });
    
  } catch (error) {
    console.error('[HUD Generate] Error:', error);
    return NextResponse.json({ error: 'Generation failed', details: String(error) }, { status: 500 });
  }
}

function buildVisualPrompt(analysis: Record<string, unknown>): string {
  const isRed = analysis.overall_color_scheme === 'red' || analysis.is_mismatch;
  const colorScheme = isRed 
    ? 'RED color scheme (threats, mismatch, danger). Red tint overlay on scene. Red bars, red labels, red radar sweep.'
    : 'GREEN color scheme (positive, bonded, safe). Green/teal bars, green connection lines, golden targeting reticle.';

  // Build biometrics string
  const biometrics = analysis.biometrics as Record<string, { level: string }> | undefined;
  const bioString = Object.entries(biometrics || {})
    .map(([key, val]) => `${key.toUpperCase()}: ${val.level}`)
    .join('\n');

  // Build people/bonds string
  const people = analysis.people_or_animals as Array<{ description: string; label: string; bond_status: string }> | undefined;
  const peopleString = (people || [])
    .map(p => `- ${p.description}: label "${p.label}" with ${p.bond_status === 'STRANGER' || p.bond_status === 'THREAT' ? 'RED "NO BOND"' : 'GREEN bond line'}`)
    .join('\n');

  // Build resources string  
  const resources = analysis.resources_to_label as Array<{ what: string; label: string }> | undefined;
  const resourcesString = (resources || [])
    .map(r => `- ${r.what}: label "${r.label}"`)
    .join('\n');

  // Build connection lines string
  const connections = analysis.connection_lines as Array<{ from: string; to: string; type: string; color: string }> | undefined;
  const connectionsString = (connections || [])
    .map(c => `- ${c.color.toUpperCase()} line from ${c.from} to ${c.to} (${c.type})`)
    .join('\n');

  const rightPanel = analysis.right_panel as Record<string, string> | undefined;
  const primaryTarget = analysis.primary_target as { what?: string; label?: string; analysis?: string } | undefined;
  const costBenefit = analysis.cost_benefit as { show?: boolean; payoff?: string; cost?: string } | undefined;
  const action = analysis.action as { recommendation?: string; urgency?: string } | undefined;
  const terrainFeatures = analysis.terrain_features as Array<unknown> | undefined;
  const mismatchDetails = analysis.mismatch_details as string | undefined;

  return `Edit this image to add an "Evolutionary HUD" overlay - a sci-fi video game style heads-up display showing what the brain is actually computing for survival and reproduction.

COLOR SCHEME: ${colorScheme}

=== LEFT PANEL (semi-transparent dark box, top-left) ===
Biometric readouts with horizontal bar graphs:
${bioString}

Bars should be colored: green/teal for healthy levels, yellow for moderate, red for concerning.

=== RIGHT PANEL (semi-transparent dark box, top-right or bottom-right) ===
Status readouts:
- Resource Value: ${rightPanel?.resource_value || 'N/A'}
- Tribe Status: ${rightPanel?.tribe_status || 'N/A'}
- Mate Opportunity: ${rightPanel?.mate_opportunity || 'N/A'}
- Threat Level: ${rightPanel?.threat_level || 'N/A'}
- Social Bond: ${rightPanel?.social_bond || 'N/A'}

=== CENTER - PRIMARY TARGET ===
Place a ${isRed ? 'red/orange' : 'golden/green'} targeting reticle (crosshairs in circle) on: ${primaryTarget?.what || 'main subject'}
Label above reticle: "${primaryTarget?.label || ''}"
Below reticle: "ANALYSIS: ${primaryTarget?.analysis || ''}"

=== ACTION RECOMMENDATION ===
${action?.urgency === 'CRITICAL' || action?.urgency === 'HIGH' 
  ? `Large, prominent text: "ACTION: ${action?.recommendation}" in ${isRed ? 'RED' : 'GREEN'}`
  : `Smaller text in right panel: "Action: ${action?.recommendation}"`}

=== COST-BENEFIT (if applicable) ===
${costBenefit?.show 
  ? `Show arrows near target:
- GREEN arrow UP with "PAYOFF: ${costBenefit.payoff}"
- RED arrow DOWN with "COST: ${costBenefit.cost}"`
  : 'No cost-benefit display needed'}

=== PEOPLE/ANIMALS TO LABEL ===
${peopleString || 'None'}

=== RESOURCES TO LABEL ===
${resourcesString || 'None'}

=== CONNECTION LINES ===
${connectionsString || 'None - draw green lines between bonded individuals, red "NO BOND" tags on strangers'}

=== TERRAIN (if landscape) ===
${(terrainFeatures || []).length > 0 
  ? 'Draw subtle blue/cyan outline on terrain features (cliffs, water sources, shelter)' 
  : ''}

${analysis.is_mismatch 
  ? `=== MISMATCH WARNING ===
Add a subtle RED tint/vignette to the entire image.
Add scanning radar sweep effect (red semicircle).
Text at bottom: "⚠ ENVIRONMENTAL MISMATCH: ${mismatchDetails}"` 
  : ''}

STYLE REQUIREMENTS:
- Semi-transparent dark panels (rgba black ~75% opacity)
- Glowing edges on panels (subtle cyan or color-matched glow)
- Clean sans-serif font (like SF Pro, Roboto, or similar)
- Horizontal bar graphs for biometrics (not circular)
- Keep original image fully visible beneath overlay
- Video game / fighter jet cockpit aesthetic
- Labels should have small dark backgrounds for readability

OUTPUT THE EDITED IMAGE with all these HUD elements overlaid.`;
}
