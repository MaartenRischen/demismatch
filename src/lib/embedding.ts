export async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch('/api/embed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate embedding');
  }

  const data = await response.json();
  return data.embedding;
}

