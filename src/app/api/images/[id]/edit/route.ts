import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// DEV ONLY: Edit image using Gemini via OpenRouter
// This endpoint will be removed before going live

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const imageId = parseInt(id);

    if (isNaN(imageId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    const { prompt, imageBase64 } = await request.json();

    if (!prompt || !imageBase64) {
      return NextResponse.json({ error: 'Missing prompt or image data' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (!supabaseUrl || !supabaseKey || !openRouterKey) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the current image record
    const { data: imageRecord, error: fetchError } = await supabase
      .from('image_embeddings')
      .select('*')
      .eq('id', imageId)
      .single();

    if (fetchError || !imageRecord) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    console.log(`[Edit] Processing edit for image ${imageId}: "${prompt.substring(0, 50)}..."`);

    // Call OpenRouter with Gemini 3 Pro Image for image editing
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://demismatch.com',
        'X-Title': 'Demismatch Image Editor'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              },
              {
                type: 'text',
                text: `Edit this image: ${prompt}. Keep the same aspect ratio and general composition unless the edit specifically requires changing them. Output the edited image.`
              }
            ]
          }
        ]
      })
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('[Edit] OpenRouter error:', errorText);
      return NextResponse.json({
        error: `Image generation failed: ${openRouterResponse.status}`,
        details: errorText
      }, { status: 500 });
    }

    const openRouterData = await openRouterResponse.json();

    // Check for inline_data format (Gemini's image output format)
    const assistantMessage = openRouterData.choices?.[0]?.message;
    let newImageBase64: string | null = null;

    // Try different response formats
    if (assistantMessage?.content) {
      // Check if content is an array with image parts
      if (Array.isArray(assistantMessage.content)) {
        for (const part of assistantMessage.content) {
          if (part.type === 'image_url' && part.image_url?.url) {
            newImageBase64 = part.image_url.url;
            break;
          }
          if (part.inline_data?.data) {
            newImageBase64 = `data:${part.inline_data.mime_type || 'image/png'};base64,${part.inline_data.data}`;
            break;
          }
        }
      }
    }

    // Also check the images array format
    if (!newImageBase64) {
      const generatedImages = assistantMessage?.images;
      if (generatedImages && generatedImages.length > 0) {
        newImageBase64 = generatedImages[0]?.image_url?.url || generatedImages[0];
      }
    }

    if (!newImageBase64) {
      console.error('[Edit] No images in response:', JSON.stringify(openRouterData, null, 2));
      return NextResponse.json({
        error: 'No image generated - model may not support image output',
        response: openRouterData
      }, { status: 500 });
    }

    // Convert base64 to buffer for upload
    const base64Data = newImageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    const filePath = `${imageRecord.folder_name}/${imageRecord.file_name}`;

    console.log(`[Edit] Uploading edited image to: ${filePath}`);

    // Upload to Supabase Storage, replacing the original
    const { error: uploadError } = await supabase.storage
      .from('mismatch-images')
      .upload(filePath, imageBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error('[Edit] Upload error:', uploadError);
      return NextResponse.json({
        error: 'Failed to upload edited image',
        details: uploadError.message
      }, { status: 500 });
    }

    const timestamp = Date.now();
    const newImageUrl = `${supabaseUrl}/storage/v1/object/public/mismatch-images/${filePath}?t=${timestamp}`;

    console.log(`[Edit] Success! New image URL: ${newImageUrl}`);

    return NextResponse.json({
      success: true,
      imageId,
      newImageUrl,
      message: 'Image edited and replaced successfully'
    });

  } catch (error) {
    console.error('[Edit] Error:', error);
    return NextResponse.json(
      { error: 'Failed to edit image', details: String(error) },
      { status: 500 }
    );
  }
}
