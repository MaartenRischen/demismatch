import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }
    
    // Extract base64 data (remove data URL prefix if present)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
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
                text: `Analyze this image through an evolutionary psychology lens. Return a JSON object (no markdown, just raw JSON) with this structure:

{
  "scene_type": "threat|resource|mate|social|mixed|mismatch",
  "overall_color_scheme": "red|green|mixed",
  "pov_context": "brief description of whose POV and what's happening",
  "biometrics": {
    "dopamine": {"level": "LOW|MODERATE|HIGH|MAX", "reason": "brief"},
    "cortisol": {"level": "LOW|MODERATE|HIGH|MAX", "reason": "brief"},
    "serotonin": {"level": "LOW|STABLE|HIGH", "reason": "brief"},
    "oxytocin": {"level": "ZERO|LOW|MODERATE|HIGH|MAX", "reason": "brief"},
    "testosterone": {"level": "LOW|MODERATE|HIGH", "reason": "brief"},
    "adrenaline": {"level": "LOW|MODERATE|HIGH|MAX", "reason": "brief"},
    "endorphins": {"level": "LOW|MODERATE|HIGH", "reason": "brief"},
    "melatonin": {"level": "LOW|MODERATE|HIGH", "reason": "brief"}
  },
  "right_panel": {
    "resource_value": "NONE|LOW|MODERATE|HIGH",
    "tribe_status": "ISOLATED|SOLITARY|FRAGMENTED|COHESIVE|OPTIMAL",
    "mate_opportunity": "ZERO|LOW|MODERATE|HIGH|N/A",
    "threat_level": "ZERO|LOW|MODERATE|HIGH|CRITICAL",
    "social_bond": "ZERO|LOW|MODERATE|HIGH|MAX"
  },
  "primary_target": {
    "what": "main subject",
    "label": "short label like POTENTIAL MATE or APEX PREDATOR",
    "analysis": "one line analysis"
  },
  "cost_benefit": {
    "show": true or false,
    "payoff": "what's gained",
    "cost": "what's risked"
  },
  "action": {
    "recommendation": "RUN|FREEZE|APPROACH|OBSERVE|BOND|NONE REQUIRED|etc",
    "urgency": "LOW|MODERATE|HIGH|CRITICAL"
  },
  "is_mismatch": true or false,
  "mismatch_details": "if mismatch, explain what's broken about this modern environment"
}

Modern offices, phones, screens, strangers = MISMATCH with red scheme.
Nature, real tribe, real bonds = ALIGNED with green scheme.
Return ONLY valid JSON, no explanation.`
              }
            ]
          }
        ],
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      return NextResponse.json({ error: 'Analysis API failed' }, { status: 500 });
    }

    const data = await response.json();
    
    // Check if response was truncated
    if (data.choices?.[0]?.finish_reason === 'length') {
      console.error('Response truncated - max tokens reached');
      return NextResponse.json({ error: 'Analysis was truncated, please try again' }, { status: 500 });
    }
    
    try {
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        console.error('No content in response:', data);
        return NextResponse.json({ error: 'No content in response' }, { status: 500 });
      }
      
      // Clean up the response - remove markdown code blocks if present
      const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
      const analysis = JSON.parse(jsonStr);
      return NextResponse.json(analysis);
    } catch (e) {
      console.error('Parse error:', e, 'Content:', data.choices?.[0]?.message?.content?.substring(0, 500));
      return NextResponse.json({ error: 'Failed to parse analysis' }, { status: 500 });
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}

