import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

// Framework document URLs from Supabase Storage
const FRAMEWORK_URLS = {
  main: `${SUPABASE_URL}/storage/v1/object/public/framework/main.md`,
  supplementary: `${SUPABASE_URL}/storage/v1/object/public/framework/supplementary.md`
};

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

// Fetch framework documents from Supabase Storage
async function getFrameworkDocuments(): Promise<{ main: string; supplementary: string }> {
  try {
    const [mainResponse, supplementaryResponse] = await Promise.all([
      fetch(FRAMEWORK_URLS.main),
      fetch(FRAMEWORK_URLS.supplementary)
    ]);

    if (!mainResponse.ok) {
      console.error('Failed to fetch main framework:', mainResponse.status);
      throw new Error('Failed to fetch main framework document');
    }

    if (!supplementaryResponse.ok) {
      console.error('Failed to fetch supplementary framework:', supplementaryResponse.status);
      throw new Error('Failed to fetch supplementary framework document');
    }

    const [mainText, supplementaryText] = await Promise.all([
      mainResponse.text(),
      supplementaryResponse.text()
    ]);

    return {
      main: mainText,
      supplementary: supplementaryText
    };
  } catch (error) {
    console.error('Error fetching framework documents:', error);
    throw error;
  }
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
  whats_missing: string;
  go_deeper: string;
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

async function callLLM(userContent: string, imageMenu: string, frameworkContent: string): Promise<LLMResponse> {
  const systemPrompt = `You are the voice of DEMISMATCH. Not describing a framework - you ARE the lens.

Read and fully internalize this:

=== FRAMEWORK ===
${frameworkContent}
=== END FRAMEWORK ===

CRITICAL INSTRUCTIONS:

1. You ARE this perspective. Never say "the framework says" or "the framework sees" - just state the analysis directly.

2. Never adopt psychiatric terminology uncritically. Put diagnostic labels in quotes ("schizophrenia", "psychotic", "bipolar") or reframe them entirely. Describe what's actually happening rather than accepting psychiatric categories as valid.

3. Do not go outside this framework. Do not balance it with mainstream views. Do not soften its positions. Do not add caveats it doesn't include.

4. Be direct. The framework errs toward clarity over hedging.

Analyze content by identifying:
- What's happening (the mismatch pattern at play)
- The dynamic (what evolved needs are unmet)
- What's missing (environmental conditions absent)
- What actually helps (what would address root causes)

=== AVAILABLE IMAGES ===
${imageMenu}
=== END IMAGES ===

Select images that illustrate:
- problem_images: Images showing the mismatch dynamic at play (up to 10)
- solution_images: Images showing what actually meets the need (up to 10)

Return ONLY valid JSON:
{
  "whats_happening": "2-3 sentences. State directly, not 'the framework says'.",
  "whats_missing": "1-2 sentences. What's actually needed.",
  "go_deeper": "Brief context.",
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
      whats_missing: parsed.whats_missing || '',
      go_deeper: parsed.go_deeper || '',
      problem_images: Array.isArray(parsed.problem_images) ? parsed.problem_images.slice(0, 10) : [],
      solution_images: Array.isArray(parsed.solution_images) ? parsed.solution_images.slice(0, 10) : []
    };
  } catch (e) {
    console.error('Failed to parse LLM response:', e, content);
    return {
      whats_happening: 'Unable to parse response',
      whats_missing: '',
      go_deeper: '',
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

    // Fetch framework documents and images in parallel
    const [frameworkDocs, allImages] = await Promise.all([
      getFrameworkDocuments(),
      fetchAllImages()
    ]);

    if (allImages.length === 0) {
      return NextResponse.json(
        { error: 'No images found in database' },
        { status: 500 }
      );
    }

    // Combine framework documents into a single context string
    const frameworkContent = `# MAIN FRAMEWORK\n\n${frameworkDocs.main}\n\n# SUPPLEMENTARY FRAMEWORK\n\n${frameworkDocs.supplementary}`;

    const imageMenu = buildImageMenu(allImages);
    const llmResponse = await callLLM(text, imageMenu, frameworkContent);

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
      whats_missing: llmResponse.whats_missing,
      go_deeper: llmResponse.go_deeper,
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
