import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const FRAMEWORK_URL = 'https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/framework/mothership-full.md';

interface CustomFrameworkRequest {
  context: string; // e.g., "for a 12-year-old", "for clinicians", "for policy makers"
}

async function fetchFrameworkContent(): Promise<string> {
  const res = await fetch(FRAMEWORK_URL, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch framework');
  return res.text();
}

export async function POST(request: NextRequest) {
  try {
    const { context }: CustomFrameworkRequest = await request.json();

    if (!context || typeof context !== 'string') {
      return NextResponse.json(
        { error: 'Context is required (e.g., "for a 12-year-old", "for clinicians", "for policy makers")' },
        { status: 400 }
      );
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Fetch the full framework
    const frameworkContent = await fetchFrameworkContent();

    const systemPrompt = `You are an expert at adapting complex frameworks for different audiences while maintaining accuracy and core insights.

Your task: Regenerate the DEMISMATCH framework for the specified context/audience.

CRITICAL REQUIREMENTS:
1. Maintain ALL core concepts, evidence, and insights - do not simplify away important information
2. Adapt language, examples, and framing for the target audience
3. Keep the same structure and parts
4. Preserve all scientific accuracy
5. Make it accessible without dumbing it down
6. Use markdown formatting (headers, lists, etc.)
7. Return the COMPLETE framework, not a summary

If the audience is children/young teens:
- Use simpler language but keep concepts intact
- Add more concrete examples
- Explain technical terms when first used
- Keep it engaging and clear

If the audience is professionals (clinicians, policy makers, etc.):
- Use appropriate professional language
- Emphasize practical applications
- Include relevant case studies or policy implications
- Maintain rigor

Return ONLY the regenerated framework markdown, nothing else.`;

    const userPrompt = `Regenerate this framework ${context}:

${frameworkContent}

Generate the complete framework adapted for this audience. Maintain all parts, all concepts, all evidence. Adapt only the language, examples, and framing.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://demismatch.com',
        'X-Title': 'DEMISMATCH'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 16000
      })
    });

    if (!response.ok) {
      // Try fallback model
      const fallbackResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://demismatch.com',
          'X-Title': 'DEMISMATCH'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 16000
        })
      });

      if (!fallbackResponse.ok) {
        const errorText = await fallbackResponse.text();
        console.error('Fallback model failed:', errorText);
        throw new Error('Both LLM models failed');
      }

      const fallbackData = await fallbackResponse.json();
      const customFramework = fallbackData.choices[0]?.message?.content?.trim() || '';
      
      return NextResponse.json({ 
        framework: customFramework,
        context,
        model: 'gemini-2.0-flash'
      });
    }

    const data = await response.json();
    const customFramework = data.choices[0]?.message?.content?.trim() || '';

    if (!customFramework) {
      return NextResponse.json(
        { error: 'Failed to generate custom framework' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      framework: customFramework,
      context,
      model: 'claude-sonnet-4'
    });
  } catch (error) {
    console.error('Generate custom framework error:', error);
    return NextResponse.json(
      { error: 'Failed to generate custom framework. Please try again.' },
      { status: 500 }
    );
  }
}

