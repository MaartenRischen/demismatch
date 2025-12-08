import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Use a vision-capable model to analyze the screenshot
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
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: imageBase64 }
              },
              {
                type: 'text',
                text: `Analyze this screenshot completely.

1. TEXT CONTENT
Extract all readable text from the image.

2. VISUAL CONTENT
Describe everything visual:
- What platform/app/website is this? (Instagram, Twitter, Reddit, news site, etc.)
- What images, photos, or graphics are shown?
- What people are depicted? Expressions, body language, what they're doing?
- What UI elements are visible? (like counts, notification badges, infinite scroll indicators, share buttons, comment counts, ads)
- What visual design patterns are being used? (attention-grabbing elements, engagement metrics displayed prominently)
- What's the overall visual context and composition?

Be thorough - the visual elements often reveal more about mismatch dynamics than the text.`
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter vision API error:', errorText);

      // Try fallback to Google's vision model
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
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: { url: imageBase64 }
                },
                {
                  type: 'text',
                  text: `Analyze this screenshot completely.

1. TEXT CONTENT
Extract all readable text from the image.

2. VISUAL CONTENT
Describe everything visual:
- What platform/app/website is this? (Instagram, Twitter, Reddit, news site, etc.)
- What images, photos, or graphics are shown?
- What people are depicted? Expressions, body language, what they're doing?
- What UI elements are visible? (like counts, notification badges, infinite scroll indicators, share buttons, comment counts, ads)
- What visual design patterns are being used? (attention-grabbing elements, engagement metrics displayed prominently)
- What's the overall visual context and composition?

Be thorough - the visual elements often reveal more about mismatch dynamics than the text.`
                }
              ]
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (!fallbackResponse.ok) {
        throw new Error('Both vision models failed');
      }

      const fallbackData = await fallbackResponse.json();
      const analysis = fallbackData.choices?.[0]?.message?.content || '';
      return NextResponse.json({ analysis });
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Screenshot analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze screenshot' },
      { status: 500 }
    );
  }
}
