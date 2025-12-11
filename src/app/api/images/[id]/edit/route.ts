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

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        error: 'Missing SUPABASE_SERVICE_ROLE_KEY - this is required to upload edited images',
        hint: 'Add SUPABASE_SERVICE_ROLE_KEY to Railway environment variables'
      }, { status: 500 });
    }

    if (!openRouterKey) {
      return NextResponse.json({ error: 'Missing OPENROUTER_API_KEY' }, { status: 500 });
    }

    const supabaseKey = supabaseServiceKey;

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

    // Get the PUBLIC URL of the image (Nano Banana Pro requires URL, not base64)
    const filePath = `${imageRecord.folder_name}/${imageRecord.file_name}`;
    const publicImageUrl = `${supabaseUrl}/storage/v1/object/public/mismatch-images/${filePath}`;

    console.log(`[Edit] Processing edit for image ${imageId}: "${prompt.substring(0, 50)}..."`);
    console.log(`[Edit] Source image URL: ${publicImageUrl}`);

    // Call OpenRouter with Gemini for image editing
    // IMPORTANT: Must include modalities: ["image", "text"] to get image output!
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://demismatch.com',
        'X-Title': 'Demismatch Image Editor'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: publicImageUrl
                }
              },
              {
                type: 'text',
                text: `Edit this image: ${prompt}. Keep the same aspect ratio and general composition unless the edit specifically requires changing them. Output the edited image.`
              }
            ]
          }
        ],
        modalities: ['image', 'text']
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
    console.log('[Edit] OpenRouter response:', JSON.stringify(openRouterData, null, 2));

    // Check for image in response - OpenRouter returns images in message.images array
    const assistantMessage = openRouterData.choices?.[0]?.message;
    let newImageBase64: string | null = null;

    // Primary format: OpenRouter's images array (documented format)
    if (assistantMessage?.images && Array.isArray(assistantMessage.images) && assistantMessage.images.length > 0) {
      const firstImage = assistantMessage.images[0];
      // Could be { image_url: { url: "..." } } or { type: "image_url", image_url: { url: "..." } }
      newImageBase64 = firstImage?.image_url?.url || firstImage?.url || firstImage;
      console.log('[Edit] Found images array format');
    }

    // Fallback: Check if content is an array with image parts
    if (!newImageBase64 && assistantMessage?.content && Array.isArray(assistantMessage.content)) {
      for (const part of assistantMessage.content) {
        console.log('[Edit] Checking content part:', part.type, Object.keys(part));
        if (part.type === 'image_url' && part.image_url?.url) {
          newImageBase64 = part.image_url.url;
          console.log('[Edit] Found image_url format in content');
          break;
        }
        if (part.type === 'image' && part.source?.data) {
          newImageBase64 = `data:${part.source.media_type || 'image/png'};base64,${part.source.data}`;
          console.log('[Edit] Found image source format in content');
          break;
        }
        if (part.inline_data?.data) {
          newImageBase64 = `data:${part.inline_data.mime_type || 'image/png'};base64,${part.inline_data.data}`;
          console.log('[Edit] Found inline_data format in content');
          break;
        }
      }
    }

    if (!newImageBase64) {
      console.error('[Edit] No images in response. Response structure:', JSON.stringify({
        hasMessage: !!assistantMessage,
        hasImages: !!assistantMessage?.images,
        imagesLength: assistantMessage?.images?.length,
        hasContent: !!assistantMessage?.content,
        contentType: typeof assistantMessage?.content,
        reasoning: assistantMessage?.reasoning ? 'present' : 'absent'
      }));
      return NextResponse.json({
        error: 'No image generated - check server logs for response structure',
        hint: 'The model returned reasoning but no image. Try a different prompt or model.',
        response: openRouterData
      }, { status: 500 });
    }

    // Handle both URL and base64 formats
    let imageBuffer: Buffer;
    if (newImageBase64.startsWith('http://') || newImageBase64.startsWith('https://')) {
      // Fetch image from URL
      console.log('[Edit] Fetching image from URL:', newImageBase64.substring(0, 100));
      const imageResponse = await fetch(newImageBase64);
      if (!imageResponse.ok) {
        return NextResponse.json({
          error: 'Failed to fetch generated image from URL',
          details: `Status: ${imageResponse.status}`
        }, { status: 500 });
      }
      const arrayBuffer = await imageResponse.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    } else {
      // Convert base64 to buffer
      const base64Data = newImageBase64.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(base64Data, 'base64');
    }

    console.log(`[Edit] Image buffer size: ${imageBuffer.length} bytes`);
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
