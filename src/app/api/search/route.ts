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

interface RankedImage {
  file_name: string;
  reason: string;
}

interface LLMResponse {
  whats_happening: string;
  the_players: string;
  whats_missing: string;
  what_actually_helps: string;
  example_comment: string;
  problem_images: RankedImage[];
  solution_images: RankedImage[];
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

async function callLLM(userContent: string, imageMenu: string, rules: string): Promise<LLMResponse> {
  const systemPrompt = `You are the voice of DEMISMATCH.

${rules}

=== AVAILABLE IMAGES ===
${imageMenu}
=== END IMAGES ===

Select images that illustrate:
- problem_images: Images showing the mismatch dynamic at play, including the meta-dynamics of consuming this content (up to 10)
- solution_images: Images showing what actually meets the need - real actions, not consuming content (up to 10)

Return ONLY valid JSON:
{
  "whats_happening": "Brief 2-3 sentence summary of the surface event/content.",
  "the_players": "Analyze EACH party through the mismatch lens. Format as: **[Person/Group 1]:** analysis. **[Person/Group 2]:** analysis. **[The Source/Publisher]:** analysis. **[The Reader/Consumer]:** analysis.",
  "whats_missing": "What environmental conditions are absent - for the people in the story AND for the reader consuming it.",
  "what_actually_helps": "What would address the root mismatch - for the people involved AND for the reader.",
  "example_comment": "A sharp, witty 1-2 sentence comment the reader could post under the original content to share this analysis. Should be provocative but not mean - designed to make people think.",
  "problem_images": [{"file_name": "example.png", "reason": "why"}],
  "solution_images": [{"file_name": "example.png", "reason": "why"}]
}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://squaretruths.app',
      'X-Title': 'Square Truths'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this content:\n\n${userContent}` }
      ],
      temperature: 0.3,
      max_tokens: 2500
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
        'HTTP-Referer': 'https://squaretruths.app',
        'X-Title': 'Square Truths'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this content:\n\n${userContent}` }
        ],
        temperature: 0.3,
        max_tokens: 2500
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
      whats_happening: parsed.whats_happening || '',
      the_players: parsed.the_players || '',
      whats_missing: parsed.whats_missing || '',
      what_actually_helps: parsed.what_actually_helps || '',
      example_comment: parsed.example_comment || '',
      problem_images: Array.isArray(parsed.problem_images) ? parsed.problem_images.slice(0, 10) : [],
      solution_images: Array.isArray(parsed.solution_images) ? parsed.solution_images.slice(0, 10) : []
    };
  } catch (e) {
    console.error('Failed to parse LLM response:', e, content);
    return {
      whats_happening: 'Unable to parse response',
      the_players: '',
      whats_missing: '',
      what_actually_helps: '',
      example_comment: '',
      problem_images: [],
      solution_images: []
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

    const totalImages = llmResponse.problem_images.length + llmResponse.solution_images.length;
    if (totalImages === 0) {
      return NextResponse.json(
        { error: 'LLM could not select images' },
        { status: 500 }
      );
    }

    // Helper to resolve image details
    const resolveImages = (rankedImages: RankedImage[]) =>
      rankedImages
        .map((rankedImg, index) => {
          const image = allImages.find(img => img.file_name === rankedImg.file_name);
          if (!image) return null;
          return {
            id: image.id,
            title: image.title,
            body_text: image.explanation,
            image_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/mismatch-images/${image.folder_name}/${image.file_name}`,
            reason: rankedImg.reason,
            rank: index + 1
          };
        })
        .filter(Boolean);

    return NextResponse.json({
      whats_happening: llmResponse.whats_happening,
      the_players: llmResponse.the_players,
      whats_missing: llmResponse.whats_missing,
      what_actually_helps: llmResponse.what_actually_helps,
      example_comment: llmResponse.example_comment,
      problem_images: resolveImages(llmResponse.problem_images),
      solution_images: resolveImages(llmResponse.solution_images)
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
