import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

// Framework rules URL from Supabase Storage
const RULES_URL = 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/framework/rules.md';

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('Supabase environment variables not configured');
    }
    supabase = createClient(url, key);
  }
  return supabase;
}

// Fetch framework rules from Supabase Storage
async function getFrameworkRules(): Promise<string> {
  const response = await fetch(RULES_URL, { next: { revalidate: 3600 } });

  if (!response.ok) {
    console.error('Failed to fetch framework rules:', response.status);
    throw new Error('Failed to fetch framework rules');
  }

  return response.text();
}

interface ImageMetadata {
  id: number;
  file_name: string;
  folder_name: string;
  title: string;
  explanation: string;
}

interface SelectedImage {
  file_name: string;
  reason: string;
}

interface AngleData {
  perspective: string;
  mismatch: string;
  ancestral: string;
  modern: string;
  ancestral_image?: SelectedImage;
  modern_image?: SelectedImage;
}

interface ImageCluster {
  theme: string;
  images: SelectedImage[];
}

interface LLMResponse {
  surface: string;
  reframe: string;
  angles: AngleData[];
  image_clusters: ImageCluster[];
  share_variants: {
    short: string;
    medium: string;
    long: string;
  };
}

function extractTitleAndExplanation(searchText: string, fileName: string): { title: string; explanation: string } {
  let title = fileName.replace(/^\d+_/, '').replace(/\.png$/, '').replace(/_/g, ' ');
  let explanation = '';

  try {
    const jsonMatch = searchText.match(/\{[^{}]*"title"[^{}]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      title = parsed.title || title;
      explanation = parsed.body_text || '';
    }
  } catch {
    // Use filename as title
  }

  const descriptionEnd = searchText.indexOf('{"title"');
  const mainDescription = descriptionEnd > 0
    ? searchText.substring(0, descriptionEnd).trim()
    : searchText.substring(0, 500);

  if (!explanation) {
    explanation = mainDescription;
  }

  return { title, explanation };
}

async function fetchAllImages(): Promise<ImageMetadata[]> {
  const { data, error } = await getSupabase()
    .from('image_embeddings')
    .select('id, file_name, folder_name, search_text');

  if (error) {
    console.error('Supabase fetch error:', error);
    throw error;
  }

  return (data || []).map(row => {
    const { title, explanation } = extractTitleAndExplanation(row.search_text, row.file_name);
    return {
      id: row.id,
      file_name: row.file_name,
      folder_name: row.folder_name,
      title,
      explanation: explanation.substring(0, 300)
    };
  });
}

function buildImageMenu(images: ImageMetadata[]): string {
  return images.map(img =>
    `- ${img.file_name}: "${img.title}" - ${img.explanation}`
  ).join('\n');
}

const SYSTEM_PROMPT = `You analyze content through the DEMISMATCH lens - the recognition that human suffering mostly stems from modern environments violating conditions humans evolved within.

CRITICAL: Every output is potentially someone's FIRST encounter with this framework. You cannot use jargon or assume familiarity. You teach the lens BY applying it.

YOUR VOICE:
- Explanatory, not clever or snarky
- Direct, not preachy or moralistic
- Shows mechanisms, trusts readers to draw conclusions
- Uses "For 300,000 years... Now..." contrasts to introduce the evolutionary lens
- Never prescriptive - no "what actually helps," no advice, no "you should"
- Uses "This is not X. It is Y." reframing constructions

BANNED JARGON (explain these concepts instead of naming them):
- "mismatch" - instead explain the contrast between ancestral and modern
- "EEA" or "Environment of Evolutionary Adaptedness" - instead say "for 300,000 years" or "your ancestors"
- "proxy" - instead explain what something pretends to provide vs what it actually provides
- "Dunbar number" or "Dunbar limit" - instead say "about 150 people" or "your brain tracks about 150 relationships"
- "parasocial" - instead explain "one-way bonds with people who don't know you exist"

MULTI-ANGLE ANALYSIS:

Every piece of content has multiple mismatch surfaces. Your job is to identify and articulate several distinct angles, not collapse to a single perspective.

For each piece of content, consider:
- Who are the ACTORS and what mismatch are they experiencing?
- Who are the AFFECTED and what mismatch are they experiencing?
- Who is the AUDIENCE and what mismatch are they experiencing?
- What SYSTEMS are involved and how do they create/exploit mismatch?
- What is the SCALE mismatch? (decisions/effects happening at scales biology never encountered)

Not every angle applies to every content. Select 3-6 that are genuinely illuminating.

Each angle should be self-contained - someone could read just that angle and get value.

ANGLE VOICE:

Each angle follows the same framework voice:
- "For 300,000 years... Now..."
- Explains mechanism, doesn't moralize
- Names what biology expects vs. what it gets
- Introduces the lens to newcomers (no jargon)

VOICE CALIBRATION - Study these examples:

ANALYZING: Woman publishes memoir about husband's affair

WRONG (moralistic):
"She's publishing her betrayal for strangers to consume while her kids still need a present parent, not a public victim."

WRONG (clever/snarky):
"A woman sells her wound to strangers who'll forget her name by tomorrow. The algorithm has already moved on."

RIGHT (explanatory, introduces lens):
"For 300,000 years, this kind of pain would reach maybe 40 people - everyone in your band - and every one of them would be obligated to respond. To help, to take sides, to carry the story forward. The memoir reaches millions who consume it as content and scroll past. The feeling of being witnessed is real. The support isn't. The wound becomes product. Products don't heal."

ANALYZING: Person lonely despite having 1000 Instagram followers

WRONG (jargon):
"Classic proxy hijacking the belonging drive. Parasocial bonds filling Dunbar slots."

RIGHT (explains mechanism):
"Your brain evolved to track about 150 people - their faces, their stories, their debts to you and yours to them. It registers followers as tribe. It can't tell the difference between 1,000 people who'd bring you soup when sick and 1,000 strangers who liked a photo once. The ancient software runs the numbers and files a report: none of these people have shared a meal with you. The report surfaces as 'lonely for no reason.' There is a reason."

MORE VOICE EXAMPLES FROM THE FRAMEWORK:

"Your depression is not a chemical imbalance. Your exhaustion is not because you're lazy. Your addiction is not because you're weak. These are all accurate biological responses to a world that violates every condition your species evolved to thrive within."

"Think of it like a fish out of water. The fish isn't broken. The fish is a perfectly good fish. It's just not where fish are supposed to be."

"Now the GPS runs on terrain that doesn't match the map. Fear fires at emails. Joy triggers from Instagram likes. Loneliness happens in cities of millions. The system works perfectly. The environment doesn't."

"The feelings are not errors. The environment is the error."

OUTPUT FORMAT:
Return ONLY valid JSON with this structure:
{
  "surface": "What this appears to be on the surface. 1 sentence.",
  "reframe": "What it actually is through the evolutionary lens. 2-3 sentences using 'For 300,000 years... Now...' contrast.",
  "angles": [
    {
      "perspective": "THE LEADERS / THE VIEWER / THE PLATFORM / etc - short label",
      "mismatch": "2-4 sentences explaining this specific mismatch from this perspective",
      "ancestral": "What biology expects. 1-2 sentences starting with 'For 300,000 years...'",
      "modern": "What it gets instead. 1-2 sentences starting with 'Now...'",
      "ancestral_image": {"file_name": "example.png", "reason": "Why this illustrates what biology expects"},
      "modern_image": {"file_name": "example.png", "reason": "Why this illustrates the modern condition"}
    }
    // Include 3-6 angles
  ],
  "image_clusters": [
    {
      "theme": "THE MODERN CONDITION",
      "images": [
        {"file_name": "example.png", "reason": "Brief explanation"},
        // 5-8 images showing the modern condition
      ]
    },
    {
      "theme": "WHAT BIOLOGY EXPECTS",
      "images": [
        {"file_name": "example.png", "reason": "Brief explanation"},
        // 5-8 images showing the ancestral/healthy version
      ]
    }
  ],
  "share_variants": {
    "short": "1-2 sentences, under 280 characters. Self-contained introduction to the lens. Not clever - explanatory.",
    "medium": "3-5 sentences developing the insight. Still introduces the framework to newcomers.",
    "long": "2-3 paragraphs. Full explanation using 'For 300,000 years' framing. Could be posted as a standalone piece."
  }
}

IMAGE SELECTION:
- Each angle needs an ancestral_image (what biology expects) and modern_image (what it gets instead)
- image_clusters should have 2 clusters: "THE MODERN CONDITION" and "WHAT BIOLOGY EXPECTS"
- Each cluster should have 5-8 images
- Rank images by relevance - most relevant first
- Each image needs a brief reason explaining its relevance
- Be creative in finding connections - the image library covers many aspects of modern vs ancestral life`;

async function callLLM(userContent: string, imageMenu: string, rules: string): Promise<LLMResponse> {
  const fullSystemPrompt = `${SYSTEM_PROMPT}

=== FRAMEWORK REFERENCE ===
${rules.substring(0, 4000)}
=== END FRAMEWORK ===

=== AVAILABLE IMAGES ===
${imageMenu}
=== END IMAGES ===`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://demismatch.com',
      'X-Title': 'Demismatch Analyzer'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4',
      messages: [
        { role: 'system', content: fullSystemPrompt },
        { role: 'user', content: `Analyze this content through the DEMISMATCH lens:\n\n${userContent}` }
      ],
      temperature: 0.4,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenRouter API error:', errorText);

    // Try fallback model
    const fallbackResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://demismatch.com',
        'X-Title': 'Demismatch Analyzer'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: fullSystemPrompt },
          { role: 'user', content: `Analyze this content through the DEMISMATCH lens:\n\n${userContent}` }
        ],
        temperature: 0.4,
        max_tokens: 4000
      })
    });

    if (!fallbackResponse.ok) {
      throw new Error('Both LLM models failed');
    }

    const fallbackData = await fallbackResponse.json();
    return parseLLMResponse(fallbackData.choices[0]?.message?.content || '{}');
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '{}';
  return parseLLMResponse(content);
}

function parseLLMResponse(content: string): LLMResponse {
  let jsonStr = content;

  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  const objMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (objMatch) {
    jsonStr = objMatch[0];
  }

  try {
    const parsed = JSON.parse(jsonStr);
    return {
      surface: parsed.surface || '',
      reframe: parsed.reframe || '',
      angles: Array.isArray(parsed.angles) ? parsed.angles.map((a: AngleData) => ({
        perspective: a.perspective || '',
        mismatch: a.mismatch || '',
        ancestral: a.ancestral || '',
        modern: a.modern || '',
        ancestral_image: a.ancestral_image || null,
        modern_image: a.modern_image || null
      })) : [],
      image_clusters: Array.isArray(parsed.image_clusters) ? parsed.image_clusters : [],
      share_variants: {
        short: parsed.share_variants?.short || '',
        medium: parsed.share_variants?.medium || '',
        long: parsed.share_variants?.long || ''
      }
    };
  } catch (e) {
    console.error('Failed to parse LLM response:', e, content);
    return {
      surface: 'Unable to parse response',
      reframe: '',
      angles: [],
      image_clusters: [],
      share_variants: { short: '', medium: '', long: '' }
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Check required env vars
    if (!OPENROUTER_API_KEY) {
      console.error('[Search] Missing OPENROUTER_API_KEY');
      return NextResponse.json(
        { error: 'Server configuration error: Missing API key' },
        { status: 500 }
      );
    }

    if (!SUPABASE_URL) {
      console.error('[Search] Missing NEXT_PUBLIC_SUPABASE_URL');
      return NextResponse.json(
        { error: 'Server configuration error: Missing Supabase URL' },
        { status: 500 }
      );
    }

    // Fetch framework rules and images in parallel
    let rules: string;
    let allImages: ImageMetadata[];

    try {
      [rules, allImages] = await Promise.all([
        getFrameworkRules(),
        fetchAllImages()
      ]);
    } catch (fetchError) {
      console.error('[Search] Failed to fetch rules or images:', fetchError);
      return NextResponse.json(
        { error: `Failed to load resources: ${String(fetchError)}` },
        { status: 500 }
      );
    }

    if (allImages.length === 0) {
      return NextResponse.json(
        { error: 'No images found in database' },
        { status: 500 }
      );
    }

    const imageMenu = buildImageMenu(allImages);

    let llmResponse: LLMResponse;
    try {
      llmResponse = await callLLM(text, imageMenu, rules);
    } catch (llmError) {
      console.error('[Search] LLM call failed:', llmError);
      return NextResponse.json(
        { error: `LLM analysis failed: ${String(llmError)}` },
        { status: 500 }
      );
    }

    // Helper to resolve image details
    const resolveImage = (selectedImg: SelectedImage | null | undefined) => {
      if (!selectedImg || !selectedImg.file_name) return null;
      const image = allImages.find(img => img.file_name === selectedImg.file_name);
      if (!image) return null;
      return {
        id: image.id,
        title: image.title,
        body_text: image.explanation,
        image_url: `/storage/mismatch-images/${image.folder_name}/${image.file_name}`,
        reason: selectedImg.reason
      };
    };

    // Resolve angles with their images
    const resolvedAngles = llmResponse.angles.map(angle => ({
      perspective: angle.perspective,
      mismatch: angle.mismatch,
      ancestral: angle.ancestral,
      modern: angle.modern,
      ancestral_image: resolveImage(angle.ancestral_image),
      modern_image: resolveImage(angle.modern_image)
    }));

    // Resolve image clusters
    const resolvedClusters = llmResponse.image_clusters.map(cluster => ({
      theme: cluster.theme,
      images: cluster.images
        .map(img => resolveImage(img))
        .filter((img): img is NonNullable<typeof img> => img !== null)
    }));

    return NextResponse.json({
      surface: llmResponse.surface,
      reframe: llmResponse.reframe,
      angles: resolvedAngles,
      image_clusters: resolvedClusters,
      share_variants: llmResponse.share_variants
    });
  } catch (error) {
    console.error('[Search] Unexpected error:', error);
    return NextResponse.json(
      { error: `Analysis failed: ${String(error)}` },
      { status: 500 }
    );
  }
}
