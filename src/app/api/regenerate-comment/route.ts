import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

interface RegenerateRequest {
  originalContent: string;
  analysis: string;
  length: number; // 1-30 sentences
  tone: number; // 0-100 (0 = respectful, 100 = extremely sassy)
}

function getToneDescription(tone: number): string {
  if (tone <= 20) return 'respectful and thoughtful, gently questioning assumptions';
  if (tone <= 40) return 'witty but kind, using humor to make a point';
  if (tone <= 60) return 'sharp and direct, not afraid to call things out';
  if (tone <= 80) return 'sassy and provocative, with some bite';
  return 'extremely sassy and cutting, unapologetically blunt with maximum snark';
}

function getLengthDescription(length: number): string {
  if (length === 1) return 'exactly 1 sentence';
  if (length <= 3) return `exactly ${length} sentences - keep it punchy`;
  if (length <= 10) return `exactly ${length} sentences - develop the thought`;
  if (length <= 20) return `exactly ${length} sentences - a substantial mini-essay`;
  return `exactly ${length} sentences - a thorough takedown`;
}

export async function POST(request: NextRequest) {
  try {
    const { originalContent, analysis, length, tone }: RegenerateRequest = await request.json();

    if (!originalContent || !analysis) {
      return NextResponse.json(
        { error: 'Original content and analysis are required' },
        { status: 400 }
      );
    }

    const toneDesc = getToneDescription(tone);
    const lengthDesc = getLengthDescription(length);

    const systemPrompt = `You are generating a comment that someone could post in response to content they've seen online. The comment should share insights from the DEMISMATCH framework analysis.

TONE: ${toneDesc}
LENGTH: ${lengthDesc}

The comment should:
- Be written in first person as if the user is posting it
- Reference the mismatch/evolutionary perspective without being preachy
- Be memorable and shareable
- Match the requested tone exactly
- Be EXACTLY the requested length (${length} sentence${length > 1 ? 's' : ''})

Do NOT:
- Start with "I think" or "In my opinion"
- Be condescending or preachy
- Use academic language
- Mention "the framework" or "DEMISMATCH" explicitly

Return ONLY the comment text, nothing else.`;

    const userPrompt = `Original content being analyzed:
${originalContent}

Analysis from the framework:
${analysis}

Generate a ${length}-sentence comment with a ${tone <= 20 ? 'respectful' : tone <= 40 ? 'witty' : tone <= 60 ? 'sharp' : tone <= 80 ? 'sassy' : 'extremely sassy'} tone.`;

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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
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
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: 1000
        })
      });

      if (!fallbackResponse.ok) {
        throw new Error('Both LLM models failed');
      }

      const fallbackData = await fallbackResponse.json();
      const comment = fallbackData.choices[0]?.message?.content?.trim() || '';
      return NextResponse.json({ comment });
    }

    const data = await response.json();
    const comment = data.choices[0]?.message?.content?.trim() || '';

    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Regenerate comment error:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate comment' },
      { status: 500 }
    );
  }
}
