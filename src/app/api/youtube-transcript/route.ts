import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

// Extract video ID from various YouTube URL formats
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Get video metadata (title, channel)
async function fetchVideoMetadata(videoId: string): Promise<{ title: string; channel: string } | null> {
  try {
    const oembedResponse = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);

    if (oembedResponse.ok) {
      const data = await oembedResponse.json();
      return {
        title: data.title || 'Unknown Title',
        channel: data.author_name || 'Unknown Channel'
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    return null;
  }
}

// Use Gemini with video_url to transcribe YouTube video
async function transcribeVideoWithGemini(videoId: string): Promise<string> {
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://squaretruths.app',
      'X-Title': 'Square Truths'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Provide a detailed summary of everything said in this video. Include the main points, arguments, claims, and key quotes. Be thorough and capture the substance of what is communicated.'
            },
            {
              type: 'video_url',
              video_url: {
                url: youtubeUrl
              }
            }
          ]
        }
      ],
      temperature: 0.1,
      max_tokens: 8000
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini transcription error:', errorText);
    throw new Error(`Failed to transcribe video: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Fetch metadata first to validate video exists
    const metadata = await fetchVideoMetadata(videoId);

    if (!metadata) {
      return NextResponse.json(
        { error: 'Could not fetch video information. The video may be private or unavailable.' },
        { status: 404 }
      );
    }

    // Use Gemini to transcribe the video
    console.log(`Transcribing video: ${videoId} - ${metadata.title}`);
    const transcript = await transcribeVideoWithGemini(videoId);

    if (!transcript) {
      return NextResponse.json(
        { error: 'Failed to transcribe video' },
        { status: 500 }
      );
    }

    // Format the content for mismatch framework analysis
    const content = `YOUTUBE VIDEO

Title: ${metadata.title}
Channel: ${metadata.channel}
URL: https://www.youtube.com/watch?v=${videoId}

VIDEO CONTENT:
${transcript}`;

    return NextResponse.json({
      content,
      videoId,
      title: metadata.title,
      channel: metadata.channel,
      hasTranscript: true, // Gemini analyzed the actual video
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    });

  } catch (error) {
    console.error('YouTube video analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process YouTube video' },
      { status: 500 }
    );
  }
}
