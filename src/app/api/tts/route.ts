import { NextRequest, NextResponse } from 'next/server';

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_bf4a283d88080028ff7856c7a1c2756483fd6c066c9a1861';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// Best ElevenLabs voices for reading long-form content
const ELEVENLABS_VOICES = {
  // High-quality, natural-sounding voices ideal for framework reading
  rachel: '21m00Tcm4TlvDq8ikWAM', // Warm, natural female voice
  drew: '29vD33N1CtxCmqQRPOHJ',   // Natural male voice
  clyde: '2EiwWnXFnvU5JabPnv8n',  // Deep male voice
  domi: 'AZnzlk1XvdvUeBnXmlld',   // Strong female voice
  bella: 'EXAVITQu4vr4xnSDxMaL',  // Soft female voice
  adam: 'pNInz6obpgDQGcFmaJgB',   // Deep, warm male voice
};

// Default to Rachel for warm, engaging narration
const DEFAULT_VOICE_ID = ELEVENLABS_VOICES.rachel;

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId, provider = 'elevenlabs' } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Limit text length to avoid excessive API costs
    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Text too long. Maximum 5000 characters per request.' },
        { status: 400 }
      );
    }

    if (provider === 'browser') {
      // Return empty response - browser will use Web Speech API
      return NextResponse.json({ provider: 'browser', text });
    }

    // ElevenLabs TTS
    const selectedVoice = voiceId || DEFAULT_VOICE_ID;

    const response = await fetch(`${ELEVENLABS_API_URL}/${selectedVoice}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5', // Fastest, high-quality model
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      return NextResponse.json(
        { error: 'TTS generation failed', details: errorText },
        { status: response.status }
      );
    }

    // Return audio as binary
    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get available voices
export async function GET() {
  return NextResponse.json({
    voices: [
      { id: ELEVENLABS_VOICES.rachel, name: 'Rachel', description: 'Warm, natural female voice' },
      { id: ELEVENLABS_VOICES.bella, name: 'Bella', description: 'Soft female voice' },
      { id: ELEVENLABS_VOICES.domi, name: 'Domi', description: 'Strong female voice' },
      { id: ELEVENLABS_VOICES.adam, name: 'Adam', description: 'Deep, warm male voice' },
      { id: ELEVENLABS_VOICES.drew, name: 'Drew', description: 'Natural male voice' },
      { id: ELEVENLABS_VOICES.clyde, name: 'Clyde', description: 'Deep male voice' },
    ],
    defaultVoice: DEFAULT_VOICE_ID,
  });
}
