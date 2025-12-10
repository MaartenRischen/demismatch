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
        model: 'google/gemini-3-pro-preview',
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
                text: `You are an evolutionary psychology analyst creating a "survival and reproduction HUD" overlay for this image.

Analyze what an ancestral human brain would compute when seeing this scene. Consider: threats, resources, mate opportunities, tribal bonds, status dynamics.

Return JSON with this exact structure:

{
  "scene_type": "threat" | "resource" | "mate" | "social" | "mixed" | "mismatch",
  "overall_color_scheme": "red" | "green" | "mixed",
  "pov_context": "whose POV, what's happening",
  
  "biometrics": {
    "dopamine": { "level": "LOW" | "MODERATE" | "HIGH" | "MAX", "reason": "why" },
    "cortisol": { "level": "LOW" | "MODERATE" | "HIGH" | "MAX", "reason": "why" },
    "serotonin": { "level": "LOW" | "STABLE" | "HIGH", "reason": "why" },
    "oxytocin": { "level": "ZERO" | "LOW" | "MODERATE" | "HIGH" | "MAX" | "OPTIMAL", "reason": "why" },
    "testosterone": { "level": "LOW" | "MODERATE" | "HIGH", "reason": "why" },
    "adrenaline": { "level": "LOW" | "MODERATE" | "HIGH" | "MAX", "reason": "why" },
    "endorphins": { "level": "LOW" | "MODERATE" | "HIGH" | "RISING", "reason": "why" },
    "melatonin": { "level": "LOW" | "MODERATE" | "HIGH", "reason": "why" }
  },
  
  "right_panel": {
    "resource_value": "NONE" | "LOW" | "MODERATE" | "HIGH" | "description",
    "tribe_status": "ISOLATED" | "SOLITARY" | "FRAGMENTED" | "COHESIVE" | "OPTIMAL",
    "mate_opportunity": "ZERO" | "LOW" | "MODERATE" | "HIGH" | "N/A",
    "threat_level": "ZERO" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL" | "UNKNOWN",
    "social_bond": "ZERO" | "LOW" | "MODERATE" | "HIGH" | "MAX" | "SECURE"
  },
  
  "primary_target": {
    "what": "main subject to put reticle on",
    "label": "short label like 'POTENTIAL MATE' or 'APEX PREDATOR' or 'FRESH WATER'",
    "analysis": "one line like 'CREATIVE SKILL DISPLAY' or 'HIGH-RISK FORAGE'"
  },
  
  "cost_benefit": {
    "show": true/false,
    "payoff": "what's gained (e.g. 'STATUS ENHANCEMENT / SOCIAL BONDING')",
    "cost": "what's risked (e.g. 'HIGH PHYSICAL RISK')"
  },
  
  "action": {
    "recommendation": "RUN!" | "FREEZE" | "APPROACH" | "SHARE RESOURCES" | "INITIATE COURTSHIP" | "DEFEND" | "OBSERVE" | "BOND" | "NONE REQUIRED" | other appropriate action,
    "urgency": "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
  },
  
  "people_or_animals": [
    {
      "description": "who/what",
      "bond_status": "KIN" | "ALLY" | "STRANGER" | "THREAT" | "POTENTIAL_MATE",
      "label": "e.g. 'KIN-LIKE BOND: SECURE' or 'NO BOND' or 'COMPETITION (MODERATE)'"
    }
  ],
  
  "resources_to_label": [
    {
      "what": "object or feature",
      "label": "e.g. 'RESOURCE: NONE' or 'VALUE: FRESH WATER' or 'RESOURCE: ABSTRACT (DATA)'"
    }
  ],
  
  "terrain_features": [
    {
      "what": "cliffs, water, shelter, etc",
      "significance": "why it matters evolutionarily"
    }
  ],
  
  "is_mismatch": true/false,
  "mismatch_details": "if modern environment, explain what's broken: strangers everywhere, abstract resources, no real bonds, artificial light, etc.",
  
  "connection_lines": [
    {
      "from": "person/animal A",
      "to": "person/animal B", 
      "type": "BOND" | "NO_BOND" | "TRIBE_SYNC",
      "color": "green" | "red" | "yellow"
    }
  ]
}

Be specific to what you actually see. Modern offices, phones, screens = MISMATCH with red color scheme. Nature + real tribe = green scheme. Return ONLY valid JSON.`
              }
            ]
          }
        ],
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      return NextResponse.json({ error: 'Analysis API failed' }, { status: 500 });
    }

    const data = await response.json();
    
    try {
      const content = data.choices[0].message.content;
      const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
      const analysis = JSON.parse(jsonStr);
      return NextResponse.json(analysis);
    } catch (e) {
      console.error('Parse error:', e, data);
      return NextResponse.json({ error: 'Failed to parse analysis', raw: data }, { status: 500 });
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}

