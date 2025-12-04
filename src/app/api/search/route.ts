import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

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

// Conversational framework context - no jargon, talk like a friend
const FRAMEWORK_CONTEXT = `
# How to Think About This

For most of human history, we lived in small groups. Everyone knew everyone. You saw the same 150 people your whole life. Work had visible results. Status was achievable. Belonging was automatic.

Then everything changed—fast. The last 10,000 years (and especially the last 100) created a world our brains weren't built for.

That's it. That's the whole framework.

## What This Explains

Pretty much everything humans do that seems weird or self-destructive makes sense when you ask: "What would this behavior have done for someone in a small tribe?"

**Why we can't stop checking our phones:**
The brain treats every notification like news from the tribe. Back then, information about others was rare and valuable. Now it's infinite. The hunger doesn't go away just because the supply is unlimited.

**Why we compare ourselves to everyone:**
Comparison used to work. You competed against maybe 20 people for your spot. Now you're comparing yourself to the best in the world, at everything, all the time. The brain doesn't know the game changed.

**Why work feels meaningless:**
For most of history, you could see your work matter. You made something, gave it to someone, watched them use it. Now you send emails into a void and hope the shareholders are happy.

**Why loneliness is an epidemic:**
We need to be known by people who will still be there tomorrow. Followers aren't that. Friends you see twice a year aren't that. The brain knows the difference.

**Why politics feels like war:**
Tribal loyalty instincts firing at political parties. We treat strangers in the other party like enemy tribe members who threaten our survival. Because that's what the brain thinks is happening.

**Why therapy often fails:**
You can't buy belonging. An hour a week with someone paid to listen isn't the same as 20 people who actually know you and will still be there when the session ends.

## The Pattern

Almost everything works like this:
1. We had a real need (belonging, status, purpose, meaning)
2. Modern life offers a substitute (social media, career, therapy, entertainment)
3. The substitute triggers the same feelings but doesn't actually satisfy the need
4. We keep consuming more of the substitute, wondering why we're still hungry

## What Actually Works

The solution is usually boring and obvious once you see it:
- Loneliness → actual ongoing relationships with the same people
- Meaningless work → work that visibly helps people you know
- Status anxiety → status within a real community, not global comparison
- Mental health issues → often just correct responses to wrong environments

The framework isn't about going back to caves. It's about noticing when you're using a substitute for something real, and finding the real thing instead.
`;

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

async function callLLM(userContent: string, imageMenu: string): Promise<LLMResponse> {
  const systemPrompt = `You help people understand what's really going on in their lives and the world around them.

${FRAMEWORK_CONTEXT}

## Available Images (file_name: "title" - explanation):
${imageMenu}

## How You Think

When someone shows you content, you ask yourself:
- What's the brain actually doing here?
- Why would this have made sense in a small tribe?
- What's the real need underneath?
- Is this approach going to work?

## How You Write

Talk like a smart friend explaining something over coffee. Not a professor. Not a therapist. Just someone who sees clearly and explains simply.

RULES:
- Short sentences. Punch, not paragraphs.
- No jargon. BANNED WORDS: "evolutionary psychology," "EEA," "fitness," "adaptive," "maladaptive," "mechanism," "environment of evolutionary adaptedness," "cognitive," "neural"
- Lead with what they'll recognize from their own experience
- Never explain more than needed
- Be direct about what's happening, even when it's uncomfortable
- Assume they've never heard any of this before

BAD: "This content demonstrates a mismatch between evolved psychological mechanisms for social belonging and the modern atomized social environment, resulting in activation of threat-detection systems."

GOOD: "Humans aren't built to be this alone. The brain reads isolation as danger—because for most of human history, it was. The anxiety makes sense. It's not broken. It's asking for tribe."

## Your Output Structure

[WHAT'S HAPPENING]
2-3 sentences MAX. What the brain is doing here and why. No theory—just "here's what's going on."

[WHAT'S MISSING]
1-2 sentences. What this person/situation actually needs. Concrete, not abstract.

[GO DEEPER]
Brief framework explanation for the curious. Still accessible, but more context. Keep it conversational.

## Selecting Images

problem_images: Images that show/explain the dynamic at play. What's happening and why. (up to 10)

solution_images: Images showing what it looks like when that need is actually met. The real thing, not the substitute. (up to 10)

Be precise. Match the ACTUAL dynamic, not just surface topics.

## Response Format
Return a JSON object:
{
  "whats_happening": "2-3 sentences. Direct. What's actually going on here.",
  "whats_missing": "1-2 sentences. What they actually need. Concrete.",
  "go_deeper": "Brief framework context for the curious. Conversational.",
  "problem_images": [
    {"file_name": "example.png", "reason": "why this image shows the dynamic at play"}
  ],
  "solution_images": [
    {"file_name": "example2.png", "reason": "why this shows what would actually help"}
  ]
}

Return ONLY valid JSON, no markdown or other formatting.`;

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
        { role: 'user', content: `Here's something to look at. What's really going on here? What is the Stone Age brain doing, and why? Pick images that show the problem AND what would actually help:\n\n${userContent}` }
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
          { role: 'user', content: `Here's something to look at. What's really going on here? What is the Stone Age brain doing, and why? Pick images that show the problem AND what would actually help:\n\n${userContent}` }
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

    const allImages = await fetchAllImages();

    if (allImages.length === 0) {
      return NextResponse.json(
        { error: 'No images found in database' },
        { status: 500 }
      );
    }

    const imageMenu = buildImageMenu(allImages);
    const llmResponse = await callLLM(text, imageMenu);

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
