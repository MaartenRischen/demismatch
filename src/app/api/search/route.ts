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
  const response = await fetch(RULES_URL, { cache: 'no-store' });

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

interface LLMResponse {
  the_reframe: string;
  the_mechanism: string;
  problem_images: SelectedImage[];
  solution_images: SelectedImage[];
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

STRUCTURE YOUR THINKING:
1. What does this look like on the surface?
2. What is it actually, biologically/evolutionarily?
3. What does the ancient hardware expect vs what is it getting?
4. What's the pattern/mechanism at work?

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

ANALYZING: Dating app adding AI chat feature

WRONG (preachy):
"AI companions cannot replace human connection. This is a concerning trend."

RIGHT (shows the mechanism):
"For 300,000 years, courtship was practice for commitment - you learned someone's patterns, their reactions, their trustworthiness, and it all mattered because you'd be raising children in a band of 50 where everyone knew everything. The app offers practice with software that cannot be hurt, cannot betray, cannot bear children. The skills developed will not transfer. The loneliness the feature addresses will not be resolved by it."

MORE VOICE EXAMPLES FROM THE FRAMEWORK:

"Your depression is not a chemical imbalance. Your exhaustion is not because you're lazy. Your addiction is not because you're weak. These are all accurate biological responses to a world that violates every condition your species evolved to thrive within."

"Think of it like a fish out of water. The fish isn't broken. The fish is a perfectly good fish. It's just not where fish are supposed to be."

"Now the GPS runs on terrain that doesn't match the map. Fear fires at emails. Joy triggers from Instagram likes. Loneliness happens in cities of millions. The system works perfectly. The environment doesn't."

"The feelings are not errors. The environment is the error."

"The foods that satisfy - whole foods, properly prepared, eaten in social context - don't have margins worth pursuing. The foods that leave you craving more, snacking alone, eating without hunger: those are profitable."

OUTPUT FORMAT:
Return ONLY valid JSON with this structure:
{
  "the_reframe": "What this actually is, biologically. Opens with what it looks like, reveals what it is. 2-4 sentences that teach the lens through this specific case. Use 'For 300,000 years... Now...' contrast.",
  "the_mechanism": "How/why this happens. Names what the biology expects vs what it gets. 2-4 sentences explaining the pattern at work.",
  "problem_images": [
    {"file_name": "example.png", "reason": "Brief explanation of why this image illustrates the problem/dynamic"},
    ... (select 10 images that show the modern condition, the problem, or the dynamic at play)
  ],
  "solution_images": [
    {"file_name": "example.png", "reason": "Brief explanation of why this image shows what actually meets the need"},
    ... (select 10 images that show the ancestral/healthy version, what biology expects, or what actually helps)
  ],
  "share_variants": {
    "short": "1-2 sentences, under 280 characters. Self-contained introduction to the lens. Not clever - explanatory.",
    "medium": "3-5 sentences developing the insight. Still introduces the framework to newcomers.",
    "long": "2-3 paragraphs. Full explanation using 'For 300,000 years' framing. Could be posted as a standalone piece."
  }
}

IMAGE SELECTION:
- Select exactly 10 problem_images showing the modern condition, the dynamic at play, or what's happening
- Select exactly 10 solution_images showing the ancestral version, what biology expects, or what actually meets the need
- Rank images by relevance - most relevant first
- Each image needs a brief reason explaining its relevance to this specific analysis
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
      max_tokens: 3000
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
        max_tokens: 3000
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
      the_reframe: parsed.the_reframe || '',
      the_mechanism: parsed.the_mechanism || '',
      problem_images: Array.isArray(parsed.problem_images) ? parsed.problem_images : [],
      solution_images: Array.isArray(parsed.solution_images) ? parsed.solution_images : [],
      share_variants: {
        short: parsed.share_variants?.short || '',
        medium: parsed.share_variants?.medium || '',
        long: parsed.share_variants?.long || ''
      }
    };
  } catch (e) {
    console.error('Failed to parse LLM response:', e, content);
    return {
      the_reframe: 'Unable to parse response',
      the_mechanism: '',
      problem_images: [],
      solution_images: [],
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

    // Fetch framework rules and images in parallel
    const [rules, allImages] = await Promise.all([
      getFrameworkRules(),
      fetchAllImages()
    ]);

    if (allImages.length === 0) {
      return NextResponse.json(
        { error: 'No images found in database' },
        { status: 500 }
      );
    }

    const imageMenu = buildImageMenu(allImages);
    const llmResponse = await callLLM(text, imageMenu, rules);

    // Helper to resolve image details
    const resolveImage = (selectedImg: SelectedImage, index: number) => {
      if (!selectedImg || !selectedImg.file_name) return null;
      const image = allImages.find(img => img.file_name === selectedImg.file_name);
      if (!image) return null;
      return {
        id: image.id,
        title: image.title,
        body_text: image.explanation,
        image_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/mismatch-images/${image.folder_name}/${image.file_name}`,
        reason: selectedImg.reason,
        rank: index + 1
      };
    };

    // Resolve all images, filtering out any that couldn't be found
    const problemImages = llmResponse.problem_images
      .map((img, idx) => resolveImage(img, idx))
      .filter((img): img is NonNullable<typeof img> => img !== null);

    const solutionImages = llmResponse.solution_images
      .map((img, idx) => resolveImage(img, idx))
      .filter((img): img is NonNullable<typeof img> => img !== null);

    if (problemImages.length === 0 && solutionImages.length === 0) {
      return NextResponse.json(
        { error: 'Could not resolve any images' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      the_reframe: llmResponse.the_reframe,
      the_mechanism: llmResponse.the_mechanism,
      problem_images: problemImages,
      solution_images: solutionImages,
      share_variants: llmResponse.share_variants
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}
