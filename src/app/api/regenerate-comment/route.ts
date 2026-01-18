import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

interface RegenerateRequest {
  originalContent: string;
  theReframe: string;
  theMechanism: string;
  length: 'short' | 'medium' | 'long';
}

function getLengthInstruction(length: 'short' | 'medium' | 'long'): string {
  switch (length) {
    case 'short':
      return '1-2 sentences, under 280 characters total. Perfect for Twitter/X. Self-contained - someone who has never heard of this framework should understand it.';
    case 'medium':
      return '3-5 sentences. Develops the insight more fully. Still introduces the framework to newcomers through this specific example.';
    case 'long':
      return '2-3 paragraphs. Full explanation using "For 300,000 years... Now..." framing. Could be posted as a standalone piece or blog comment. Comprehensive but not preachy.';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { originalContent, theReframe, theMechanism, length }: RegenerateRequest = await request.json();

    if (!originalContent || !theReframe) {
      return NextResponse.json(
        { error: 'Original content and analysis are required' },
        { status: 400 }
      );
    }

    const lengthInstruction = getLengthInstruction(length);

    const systemPrompt = `You generate shareable text that applies the DEMISMATCH lens to content.

YOUR VOICE:
- Explanatory, not clever or snarky
- Direct, not preachy or moralistic
- Shows mechanisms, trusts readers to draw conclusions
- Uses "For 300,000 years... Now..." contrasts when appropriate
- Never prescriptive - no advice, no "you should"

BANNED:
- Jargon: "mismatch," "EEA," "proxy," "Dunbar number," "parasocial"
- Moralizing or judgment
- Cleverness or snark
- Starting with "I think" or giving opinions
- Mentioning "the framework" or "DEMISMATCH" explicitly

LENGTH REQUIREMENT: ${lengthInstruction}

VOICE EXAMPLES:

GOOD (explanatory):
"For 300,000 years, this kind of pain would reach maybe 40 people - everyone in your band - and every one of them would be obligated to respond. The memoir reaches millions who consume it as content and scroll past. The feeling of being witnessed is real. The support isn't."

GOOD (mechanism):
"Your brain evolved to track about 150 people. It registers followers as tribe. It can't tell the difference between 1,000 people who'd bring you soup when sick and 1,000 strangers who liked a photo once. The loneliness signal fires anyway."

BAD (moralistic):
"She's publishing her betrayal for strangers to consume while her kids still need a present parent."

BAD (clever):
"A woman sells her wound to strangers who'll forget her name by tomorrow."

Return ONLY the shareable text, nothing else. No quotes around it.`;

    const userPrompt = `Original content being analyzed:
${originalContent}

The reframe (what this actually is):
${theReframe}

The mechanism (how/why this happens):
${theMechanism}

Generate a ${length} shareable version of this analysis.`;

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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
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
          'HTTP-Referer': 'https://demismatch.com',
          'X-Title': 'Demismatch Analyzer'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.6,
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
      { error: 'Failed to regenerate' },
      { status: 500 }
    );
  }
}
