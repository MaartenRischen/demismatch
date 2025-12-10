import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image, analysis } = await request.json();
    
    if (!image || !analysis) {
      return NextResponse.json({ error: 'Missing image or analysis' }, { status: 400 });
    }
    
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    
    // Build detailed visual prompt from analysis
    const visualPrompt = buildVisualPrompt(analysis);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-preview:thinking',
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
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      return NextResponse.json({ error: 'Generation API failed' }, { status: 500 });
    }

    const data = await response.json();
    
    // Handle image response - check various formats
    if (data.choices?.[0]?.message?.content) {
      const content = data.choices[0].message.content;
      
      // Check for base64 image in array format
      if (Array.isArray(content)) {
        const imageBlock = content.find((c: any) => c.type === 'image' || c.image);
        if (imageBlock) {
          const imgData = imageBlock.image?.data || imageBlock.data;
          return NextResponse.json({ 
            image: `data:image/png;base64,${imgData}` 
          });
        }
      }
      
      // Direct base64 string
      if (typeof content === 'string' && content.match(/^[A-Za-z0-9+/=]+$/)) {
        return NextResponse.json({ 
          image: `data:image/png;base64,${content}` 
        });
      }
    }
    
    // Check for image in different response format
    if (data.data?.[0]?.b64_json) {
      return NextResponse.json({ 
        image: `data:image/png;base64,${data.data[0].b64_json}` 
      });
    }
    
    // If no image generated, return error with analysis for canvas fallback
    return NextResponse.json({ 
      error: 'No image in response - use canvas fallback',
      analysis: analysis,
      raw: data
    }, { status: 500 });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

function buildVisualPrompt(analysis: any): string {
  const isRed = analysis.overall_color_scheme === 'red' || analysis.is_mismatch;
  const colorScheme = isRed 
    ? 'RED color scheme (threats, mismatch, danger). Red tint overlay on scene. Red bars, red labels, red radar sweep.'
    : 'GREEN color scheme (positive, bonded, safe). Green/teal bars, green connection lines, golden targeting reticle.';

  // Build biometrics string
  const bioString = Object.entries(analysis.biometrics || {})
    .map(([key, val]: [string, any]) => `${key.toUpperCase()}: ${val.level}`)
    .join('\n');

  // Build people/bonds string
  const peopleString = (analysis.people_or_animals || [])
    .map((p: any) => `- ${p.description}: label "${p.label}" with ${p.bond_status === 'STRANGER' || p.bond_status === 'THREAT' ? 'RED "NO BOND"' : 'GREEN bond line'}`)
    .join('\n');

  // Build resources string  
  const resourcesString = (analysis.resources_to_label || [])
    .map((r: any) => `- ${r.what}: label "${r.label}"`)
    .join('\n');

  // Build connection lines string
  const connectionsString = (analysis.connection_lines || [])
    .map((c: any) => `- ${c.color.toUpperCase()} line from ${c.from} to ${c.to} (${c.type})`)
    .join('\n');

  return `Edit this image to add an "Evolutionary HUD" overlay - a sci-fi video game style heads-up display showing what the brain is actually computing for survival and reproduction.

COLOR SCHEME: ${colorScheme}

=== LEFT PANEL (semi-transparent dark box, top-left) ===
Biometric readouts with horizontal bar graphs:
${bioString}

Bars should be colored: green/teal for healthy levels, yellow for moderate, red for concerning.

=== RIGHT PANEL (semi-transparent dark box, top-right or bottom-right) ===
Status readouts:
- Resource Value: ${analysis.right_panel?.resource_value || 'N/A'}
- Tribe Status: ${analysis.right_panel?.tribe_status || 'N/A'}
- Mate Opportunity: ${analysis.right_panel?.mate_opportunity || 'N/A'}
- Threat Level: ${analysis.right_panel?.threat_level || 'N/A'}
- Social Bond: ${analysis.right_panel?.social_bond || 'N/A'}

=== CENTER - PRIMARY TARGET ===
Place a ${isRed ? 'red/orange' : 'golden/green'} targeting reticle (crosshairs in circle) on: ${analysis.primary_target?.what || 'main subject'}
Label above reticle: "${analysis.primary_target?.label || ''}"
Below reticle: "ANALYSIS: ${analysis.primary_target?.analysis || ''}"

=== ACTION RECOMMENDATION ===
${analysis.action?.urgency === 'CRITICAL' || analysis.action?.urgency === 'HIGH' 
  ? `Large, prominent text: "ACTION: ${analysis.action?.recommendation}" in ${isRed ? 'RED' : 'GREEN'}`
  : `Smaller text in right panel: "Action: ${analysis.action?.recommendation}"`}

=== COST-BENEFIT (if applicable) ===
${analysis.cost_benefit?.show 
  ? `Show arrows near target:
- GREEN arrow UP with "PAYOFF: ${analysis.cost_benefit.payoff}"
- RED arrow DOWN with "COST: ${analysis.cost_benefit.cost}"`
  : 'No cost-benefit display needed'}

=== PEOPLE/ANIMALS TO LABEL ===
${peopleString || 'None'}

=== RESOURCES TO LABEL ===
${resourcesString || 'None'}

=== CONNECTION LINES ===
${connectionsString || 'None - draw green lines between bonded individuals, red "NO BOND" tags on strangers'}

=== TERRAIN (if landscape) ===
${(analysis.terrain_features || []).length > 0 
  ? 'Draw subtle blue/cyan outline on terrain features (cliffs, water sources, shelter)' 
  : ''}

${analysis.is_mismatch 
  ? `=== MISMATCH WARNING ===
Add a subtle RED tint/vignette to the entire image.
Add scanning radar sweep effect (red semicircle).
Text at bottom: "⚠ ENVIRONMENTAL MISMATCH: ${analysis.mismatch_details}"` 
  : ''}

STYLE REQUIREMENTS:
- Semi-transparent dark panels (rgba black ~75% opacity)
- Glowing edges on panels (subtle cyan or color-matched glow)
- Clean sans-serif font (like SF Pro, Roboto, or similar)
- Horizontal bar graphs for biometrics (not circular)
- Keep original image fully visible beneath overlay
- Video game / fighter jet cockpit aesthetic
- Labels should have small dark backgrounds for readability

Generate the edited image with the HUD overlay.`;
}

