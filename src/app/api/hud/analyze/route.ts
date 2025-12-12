import { NextRequest, NextResponse } from 'next/server';

// Evolutionary HUD Analysis - Based on Evodash Vision architecture
// Uses Claude Vision for semantic understanding + evolutionary psychology framework

const SYSTEM_PROMPT = `You are an evolutionary psychology analyst creating a "survival and reproduction HUD" overlay.

FRAMEWORK: Fitness-First Interface Theory (Cosmides, Tooby, Hoffman)
You analyze what an ancestral human brain computes when seeing a scene.

MECHANISM TAGS:
- Survival-Immediate: threat, pathogen, fire_smoke, traffic_height_drowning, navigation_escape, resource_immediate
- Survival-Midterm: shelter_cover, territory_affordance, social_support
- Reproduction: mate_value, parental_care, kinship, status_prestige, coalition, norms_reputation
- Special: uncertain_mixed, mismatch_supernormal

SCORING: Evolutionary importance 0-100 based on fitness relevance.

CONSTRAINTS:
- Species-average observer (no individual profiling)
- No protected attributes, no medicalization
- Ground rationales in evolutionary logic`;

const USER_PROMPT = `Analyze this image through an evolutionary psychology lens.

Return ONLY valid JSON with this exact structure:

{
  "scene_type": "threat" | "resource" | "mate" | "social" | "mixed" | "mismatch",
  "overall_color_scheme": "red" | "green" | "mixed",
  "pov_context": "brief description of whose POV and what's happening",
  
  "biometrics": {
    "dopamine": { "level": "LOW" | "MODERATE" | "HIGH" | "MAX", "score": 0-100 },
    "cortisol": { "level": "LOW" | "MODERATE" | "HIGH" | "MAX", "score": 0-100 },
    "serotonin": { "level": "LOW" | "STABLE" | "HIGH", "score": 0-100 },
    "oxytocin": { "level": "ZERO" | "LOW" | "MODERATE" | "HIGH" | "MAX", "score": 0-100 },
    "testosterone": { "level": "LOW" | "MODERATE" | "HIGH", "score": 0-100 },
    "adrenaline": { "level": "LOW" | "MODERATE" | "HIGH" | "MAX", "score": 0-100 }
  },
  
  "status_panel": {
    "resource_value": { "level": "NONE" | "LOW" | "MODERATE" | "HIGH", "detail": "what resources" },
    "tribe_status": { "level": "ISOLATED" | "FRAGMENTED" | "COHESIVE" | "OPTIMAL", "detail": "why" },
    "mate_opportunity": { "level": "ZERO" | "LOW" | "MODERATE" | "HIGH", "detail": "if applicable" },
    "threat_level": { "level": "ZERO" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL", "detail": "what threats" },
    "social_bond": { "level": "ZERO" | "LOW" | "MODERATE" | "HIGH" | "SECURE", "detail": "bond quality" }
  },
  
  "primary_target": {
    "what": "main subject description",
    "label": "short label like POTENTIAL MATE or APEX PREDATOR or FRESH WATER",
    "analysis": "one-line evolutionary significance",
    "importance_score": 0-100,
    "mechanisms": ["array", "of", "mechanism_tags"]
  },
  
  "detected_items": [
    {
      "id": "item_0",
      "class": "object class",
      "position": "left" | "center" | "right",
      "vertical": "top" | "middle" | "bottom",
      "size": "small" | "medium" | "large",
      "mechanisms": ["mechanism_tags"],
      "importance_score": 0-100,
      "label": "HUD label text",
      "color": "green" | "red" | "yellow" | "cyan"
    }
  ],
  
  "people": [
    {
      "id": "person_0",
      "description": "brief description",
      "position": "left" | "center" | "right",
      "bond_status": "KIN" | "ALLY" | "STRANGER" | "THREAT" | "POTENTIAL_MATE",
      "label": "e.g. KIN-LIKE BOND: SECURE or NO BOND",
      "importance_score": 0-100
    }
  ],
  
  "connections": [
    {
      "from": "person_0",
      "to": "person_1",
      "type": "BOND" | "NO_BOND" | "COMPETITION" | "ATTRACTION",
      "color": "green" | "red" | "yellow"
    }
  ],
  
  "action": {
    "recommendation": "RUN" | "FREEZE" | "APPROACH" | "BOND" | "COURT" | "DEFEND" | "OBSERVE" | "NONE",
    "urgency": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
    "rationale": "brief evolutionary explanation"
  },
  
  "is_mismatch": true | false,
  "mismatch_details": "if modern environment, explain evolutionary mismatch",
  
  "aggregate": {
    "top_survival_items": ["list of most fitness-relevant survival items"],
    "top_reproduction_items": ["list of most fitness-relevant reproduction items"],
    "global_summary": "2-3 sentence evolutionary summary of the scene",
    "emotional_valence": -1.0 to 1.0,
    "arousal_level": 0.0 to 1.0
  }
}

Be specific to what you actually see. Modern offices, phones, screens = MISMATCH. Nature + real tribe = positive fitness environment.`;

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return NextResponse.json({ error: 'Missing OPENROUTER_API_KEY' }, { status: 500 });
    }

    const MAX_ANTHROPIC_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB hard limit (Anthropic)

    // Extract base64 data and detect format
    const imageMatch = image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!imageMatch) {
      return NextResponse.json({ error: 'Invalid image format. Expected data URL.' }, { status: 400 });
    }
    
    let mimeType = imageMatch[1]; // png, jpeg, jpg, webp, avif, etc.
    let base64Data = imageMatch[2];
    
    // Claude only supports: jpeg, png, gif, webp
    // Convert unsupported formats (like AVIF) to PNG
    const supportedFormats = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
    if (!supportedFormats.includes(mimeType.toLowerCase())) {
      console.log(`[HUD Analyze] Converting unsupported format ${mimeType} to PNG`);
      
      try {
        // Use sharp to convert to PNG
        const sharp = (await import('sharp')).default;
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const pngBuffer = await sharp(imageBuffer)
          .png()
          .toBuffer();
        base64Data = pngBuffer.toString('base64');
        mimeType = 'png';
      } catch (conversionError) {
        console.error('[HUD Analyze] Conversion error:', conversionError);
        return NextResponse.json({ 
          error: 'Failed to convert image format. Please use PNG, JPEG, GIF, or WebP.',
          details: String(conversionError)
        }, { status: 400 });
      }
    }
    
    // IMPORTANT: Anthropic expects image media_type to be one of:
    // image/jpeg, image/png, image/gif, image/webp
    // So we must normalize *to* jpeg (never to jpg) when building data URLs.
    if (mimeType.toLowerCase() === 'jpg') mimeType = 'jpeg';

    // If the image is larger than Anthropic's 5MB limit, downscale + recompress.
    // (Even if the client image is JPG/PNG/WebP, the *binary* must be <= 5MB.)
    try {
      const inputBytes = Buffer.from(base64Data, 'base64');
      if (inputBytes.length > MAX_ANTHROPIC_IMAGE_BYTES) {
        console.log('[HUD Analyze] Image exceeds 5MB; downscaling/recompressing', {
          input_bytes: inputBytes.length,
          format: mimeType
        });

        const sharp = (await import('sharp')).default;

        let quality = 80;
        let maxDim = 1600;
        // Use Uint8Array to avoid Node 22 Buffer generic type incompatibilities with sharp's TS overloads.
        let out: Uint8Array = inputBytes;

        // Always produce jpeg for size control.
        // We iterate to ensure we get under the 5MB cap.
        for (let i = 0; i < 6; i++) {
          const next = await sharp(out)
            .rotate()
            .resize({ width: maxDim, height: maxDim, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality, mozjpeg: true })
            .toBuffer();
          out = next;

          if (out.length <= MAX_ANTHROPIC_IMAGE_BYTES) break;

          quality = Math.max(35, quality - 10);
          maxDim = Math.max(900, maxDim - 150);
        }

        if (out.length > MAX_ANTHROPIC_IMAGE_BYTES) {
          return NextResponse.json(
            {
              error: 'Image too large',
              details: `Image exceeds 5MB maximum and could not be compressed below the limit (final ${out.length} bytes). Try a smaller image.`
            },
            { status: 413 }
          );
        }

        base64Data = Buffer.from(out).toString('base64');
        mimeType = 'jpeg';
      }
    } catch (resizeErr) {
      console.error('[HUD Analyze] Resize/recompress error:', resizeErr);
      // Don't fail hard — try the original; provider will enforce limits.
    }
    
    const imageDataUrl = `data:image/${mimeType};base64,${base64Data}`;
    
    console.log('[HUD Analyze] Starting Claude Vision analysis...', { format: mimeType });
    
    // Use Claude Sonnet for vision analysis (proven to work in Evodash)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://demismatch.com',
        'X-Title': 'Demismatch HUD'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: imageDataUrl }
              },
              {
                type: 'text',
                text: USER_PROMPT
              }
            ]
          }
        ],
        max_tokens: 4000,
        temperature: 0.3
      })
    });

    const requestId =
      response.headers.get('x-openrouter-request-id') ||
      response.headers.get('x-request-id') ||
      response.headers.get('cf-ray') ||
      undefined;

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[HUD Analyze] OpenRouter error:', errorText);
      return NextResponse.json(
        { error: 'Analysis failed', details: errorText, request_id: requestId },
        // Avoid 5xx so Cloudflare doesn't replace JSON with its HTML error page.
        { status: 424 }
      );
    }

    const data = await response.json();
    
    console.log('[HUD Analyze] Response received');

    // OpenRouter can sometimes return HTTP 200 with an error payload.
    if (data?.error) {
      console.error('[HUD Analyze] OpenRouter returned error payload:', data.error);
      return NextResponse.json(
        {
          error: 'Analysis failed',
          details: typeof data.error === 'string' ? data.error : JSON.stringify(data.error),
          request_id: requestId
        },
        // Avoid 5xx so Cloudflare doesn't replace JSON with its HTML error page.
        { status: 424 }
      );
    }
    
    try {
      const choice0 = data?.choices?.[0];
      const assistantMessage = choice0?.message;
      if (!assistantMessage) {
        const shapeHint = {
          has_choices: Array.isArray(data?.choices),
          choices_len: Array.isArray(data?.choices) ? data.choices.length : 0,
          choice0_keys: choice0 ? Object.keys(choice0) : undefined
        };
        console.error('[HUD Analyze] No message in response. Shape hint:', shapeHint);
        return NextResponse.json(
          {
            error: 'Analysis failed',
            details: 'OpenRouter returned no assistant message',
            request_id: requestId,
            shape_hint: shapeHint,
            raw_response_snippet: JSON.stringify(data)?.slice(0, 1500)
          },
          // Avoid 5xx so Cloudflare doesn't replace JSON with its HTML error page.
          { status: 424 }
        );
      }

      // OpenRouter normalizes many providers, but "content" shape differs:
      // - string (common)
      // - array of parts: [{ type: "text", text: "..." }, ...] (Anthropic-style)
      const extractText = (msg: any): string => {
        const c = msg?.content;
        if (typeof c === 'string') return c;
        if (Array.isArray(c)) {
          const textParts = c
            .filter((p: any) => p && (p.type === 'text' || typeof p.text === 'string'))
            .map((p: any) => (typeof p.text === 'string' ? p.text : ''));
          return textParts.join('\n').trim();
        }
        // Some providers may put useful text in reasoning fields
        if (typeof msg?.reasoning === 'string' && msg.reasoning.trim()) return msg.reasoning;
        return '';
      };

      const contentText = extractText(assistantMessage);
      if (!contentText) {
        const debug = {
          hasChoices: !!data?.choices,
          choiceCount: data?.choices?.length,
          contentType: typeof assistantMessage?.content,
          contentIsArray: Array.isArray(assistantMessage?.content),
          hasReasoning: !!assistantMessage?.reasoning,
          finishReason: data?.choices?.[0]?.finish_reason,
          provider: data?.provider,
          model: data?.model
        };
        console.error('[HUD Analyze] Missing content. Debug:', JSON.stringify(debug, null, 2));
        return NextResponse.json(
          {
            error: 'Analysis failed',
            details: 'OpenRouter returned empty/non-text content',
            request_id: requestId,
            shape_hint: debug,
            raw_response_snippet: JSON.stringify(data)?.slice(0, 1500)
          },
          // Avoid 5xx so Cloudflare doesn't replace JSON with its HTML error page.
          { status: 424 }
        );
      }

      // Extract JSON from response (handle code blocks)
      let jsonStr = contentText;
      const jsonMatch = contentText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) jsonStr = jsonMatch[1];
      jsonStr = jsonStr.trim();
      
      // Parse and validate
      const analysis = JSON.parse(jsonStr);
      
      // Add metadata
      analysis.metadata = {
        llm_model: 'anthropic/claude-sonnet-4',
        created_at: new Date().toISOString(),
        processing_method: 'claude_vision'
      };
      
      console.log('[HUD Analyze] Analysis complete:', {
        scene_type: analysis.scene_type,
        is_mismatch: analysis.is_mismatch,
        items_count: analysis.detected_items?.length || 0,
        people_count: analysis.people?.length || 0
      });
      
      return NextResponse.json(analysis);
      
    } catch (parseError) {
      console.error('[HUD Analyze] Parse error:', parseError);
      const rawMsg = data?.choices?.[0]?.message;
      const rawContent =
        typeof rawMsg?.content === 'string'
          ? rawMsg.content
          : Array.isArray(rawMsg?.content)
            ? rawMsg.content.map((p: any) => (p?.text ? String(p.text) : '')).join('\n')
            : '';

      console.error('[HUD Analyze] Raw content (truncated):', rawContent?.substring?.(0, 800));
      return NextResponse.json(
        {
          error: 'Failed to parse analysis',
          details: String(parseError),
          request_id: requestId,
          raw: rawContent?.substring?.(0, 2000) || null
        },
        // Treat as upstream/model failure (not a server crash) and avoid 5xx HTML pages.
        { status: 424 }
      );
    }
    
  } catch (error) {
    console.error('[HUD Analyze] Error:', error);
    return NextResponse.json({ error: 'Analysis failed', details: String(error) }, { status: 500 });
  }
}
