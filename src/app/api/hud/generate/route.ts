import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image, analysis } = await request.json();
    
    if (!image || !analysis) {
      return NextResponse.json({ error: 'Missing image or analysis' }, { status: 400 });
    }
    
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    
    // Build visual prompt from analysis
    const isRed = analysis.overall_color_scheme === 'red' || analysis.is_mismatch;
    const colorScheme = isRed 
      ? 'RED color scheme - red tint, red panels, red targeting reticle'
      : 'GREEN color scheme - green/teal panels, golden targeting reticle';
    
    const biometrics = Object.entries(analysis.biometrics || {})
      .map(([key, val]: [string, any]) => `${key}: ${val.level}`)
      .join(', ');
    
    const prompt = `Edit this image to add a sci-fi "Evolutionary HUD" overlay. Style: video game / fighter jet cockpit.

COLOR SCHEME: ${colorScheme}

LEFT PANEL (semi-transparent dark box, top-left):
Biometric bars: ${biometrics}

RIGHT PANEL (top-right):
Resource: ${analysis.right_panel?.resource_value || 'N/A'}
Tribe: ${analysis.right_panel?.tribe_status || 'N/A'}
Threat: ${analysis.right_panel?.threat_level || 'N/A'}
Bond: ${analysis.right_panel?.social_bond || 'N/A'}

CENTER: Place a ${isRed ? 'red' : 'golden'} targeting reticle on the main subject.
Label: "${analysis.primary_target?.label || 'TARGET'}"
Below: "ANALYSIS: ${analysis.primary_target?.analysis || ''}"

${analysis.action?.urgency === 'HIGH' || analysis.action?.urgency === 'CRITICAL' 
  ? `BOTTOM: Large text "ACTION: ${analysis.action?.recommendation}" in ${isRed ? 'red' : 'green'}` 
  : ''}

${analysis.is_mismatch 
  ? `Add subtle RED tint/vignette. Bottom warning: "⚠ MISMATCH: ${(analysis.mismatch_details || '').substring(0, 60)}"` 
  : ''}

Keep original image visible. Semi-transparent dark panels. Clean sans-serif font.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-image-preview',
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
                text: prompt
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
        const imageBlock = content.find((c: any) => c.type === 'image' || c.image || c.type === 'image_url');
        if (imageBlock) {
          const imgData = imageBlock.image?.data || imageBlock.data || imageBlock.image_url?.url;
          if (imgData) {
            const base64 = imgData.startsWith('data:') ? imgData : `data:image/png;base64,${imgData}`;
            return NextResponse.json({ image: base64 });
          }
        }
      }
      
      // Direct base64 string
      if (typeof content === 'string') {
        if (content.match(/^[A-Za-z0-9+/=]+$/) && content.length > 1000) {
          return NextResponse.json({ image: `data:image/png;base64,${content}` });
        }
        if (content.startsWith('data:image')) {
          return NextResponse.json({ image: content });
        }
      }
    }
    
    // Check for image in different response format
    if (data.data?.[0]?.b64_json) {
      return NextResponse.json({ image: `data:image/png;base64,${data.data[0].b64_json}` });
    }
    
    if (data.data?.[0]?.url) {
      return NextResponse.json({ image: data.data[0].url });
    }
    
    console.log('No image found in response:', JSON.stringify(data).substring(0, 500));
    return NextResponse.json({ 
      error: 'No image generated - model may not support image generation',
      analysis: analysis
    }, { status: 500 });
    
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
