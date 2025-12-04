import { NextRequest, NextResponse } from 'next/server';

// Local embedding server URL - runs sentence-transformers/all-mpnet-base-v2
const EMBEDDING_SERVER_URL = process.env.EMBEDDING_SERVER_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Call local embedding server
    const response = await fetch(`${EMBEDDING_SERVER_URL}/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Embedding server error:', errorData);
      return NextResponse.json(
        { error: errorData.error || 'Failed to generate embedding' },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    if (!data.embedding || !Array.isArray(data.embedding)) {
      console.error('Invalid embedding response:', data);
      return NextResponse.json(
        { error: 'Invalid embedding response' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ embedding: data.embedding });
  } catch (error) {
    console.error('Embedding error:', error);
    return NextResponse.json(
      { error: 'Embedding server not available. Make sure the Python server is running.' },
      { status: 500 }
    );
  }
}
