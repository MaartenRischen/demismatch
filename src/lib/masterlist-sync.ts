import { createClient, SupabaseClient } from '@supabase/supabase-js';

const MASTERLIST_PATH = 'masterlist.json';
const MASTERLIST_BUCKET = 'mismatch-data';
const IMAGES_BUCKET = 'mismatch-images';

export interface MasterlistImage {
  id: number;
  file_name: string;
  folder_name: string;
  supabase_url?: string;
  image_type?: string;
  categories?: string[];
  framework_concepts?: string[];
  tags_normalized?: string[];
  user_rating?: number | null;
  user_notes?: string | null;
  is_favorite?: boolean;
  analysis?: {
    text_title?: string;
    visual_description?: string;
    meaning_interpretation?: string;
    emotional_analysis?: string;
    content_description?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface Masterlist {
  generated_at: string;
  total_images: number;
  analyzed_images: number;
  last_synced_at?: string;
  images: MasterlistImage[];
}

// Get Supabase client with service role for admin operations
function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error('Missing Supabase credentials (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
  }
  
  return createClient(url, key);
}

// Fetch the current masterlist from storage
export async function fetchMasterlist(): Promise<Masterlist> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${MASTERLIST_BUCKET}/${MASTERLIST_PATH}?t=${Date.now()}`;
  
  const response = await fetch(publicUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch masterlist: ${response.status}`);
  }
  
  return response.json();
}

// Save the masterlist back to storage
export async function saveMasterlist(masterlist: Masterlist): Promise<void> {
  const supabase = getServiceClient();
  
  masterlist.last_synced_at = new Date().toISOString();
  masterlist.total_images = masterlist.images.length;
  
  const jsonContent = JSON.stringify(masterlist, null, 2);
  const buffer = Buffer.from(jsonContent, 'utf-8');
  
  const { error } = await supabase.storage
    .from(MASTERLIST_BUCKET)
    .upload(MASTERLIST_PATH, buffer, {
      upsert: true,
      contentType: 'application/json',
      cacheControl: 'no-cache'
    });
  
  if (error) {
    throw new Error(`Failed to save masterlist: ${error.message}`);
  }
}

// Sync a single image to the database (upsert)
export async function syncImageToDatabase(image: MasterlistImage): Promise<void> {
  const supabase = getServiceClient();
  
  const dbRow = {
    id: image.id,
    file_name: image.file_name,
    folder_name: image.folder_name,
    title: image.analysis?.text_title || image.file_name?.replace(/^\d+_/, '').replace(/\.png$/, '').replace(/_/g, ' '),
    image_url: image.supabase_url,
    image_type: image.image_type || 'problem',
    categories: image.categories || [],
    framework_concepts: image.framework_concepts || [],
    tags_normalized: image.tags_normalized || image.analysis?.tags || [],
    user_rating: image.user_rating,
    user_notes: image.user_notes,
    is_favorite: image.is_favorite || false,
  };
  
  const { error } = await supabase
    .from('image_embeddings')
    .upsert(dbRow, { onConflict: 'id' });
  
  if (error) {
    throw new Error(`Failed to sync image ${image.id} to database: ${error.message}`);
  }
}

// Remove an image from all locations (masterlist, database, storage)
export async function removeImageFromAll(imageId: number): Promise<{ 
  masterlistRemoved: boolean;
  databaseRemoved: boolean;
  storageRemoved: boolean;
  imagePath?: string;
}> {
  const supabase = getServiceClient();
  const result = {
    masterlistRemoved: false,
    databaseRemoved: false,
    storageRemoved: false,
    imagePath: undefined as string | undefined
  };
  
  // 1. Fetch current masterlist
  const masterlist = await fetchMasterlist();
  
  // 2. Find the image in masterlist
  const imageIndex = masterlist.images.findIndex(img => img.id === imageId);
  let imagePath: string | undefined;
  
  if (imageIndex !== -1) {
    const image = masterlist.images[imageIndex];
    imagePath = `${image.folder_name}/${image.file_name}`;
    result.imagePath = imagePath;
    
    // Remove from masterlist
    masterlist.images.splice(imageIndex, 1);
    await saveMasterlist(masterlist);
    result.masterlistRemoved = true;
  }
  
  // 3. Remove from database
  const { error: dbError } = await supabase
    .from('image_embeddings')
    .delete()
    .eq('id', imageId);
  
  if (!dbError) {
    result.databaseRemoved = true;
  }
  
  // 4. Remove from storage (if we found the path)
  if (imagePath) {
    const { error: storageError } = await supabase.storage
      .from(IMAGES_BUCKET)
      .remove([imagePath]);
    
    if (!storageError) {
      result.storageRemoved = true;
    }
  }
  
  return result;
}

// Update an image's metadata in both masterlist and database
export async function updateImageMetadata(
  imageId: number, 
  updates: Partial<Pick<MasterlistImage, 'image_type' | 'user_rating' | 'user_notes' | 'is_favorite' | 'categories' | 'framework_concepts' | 'tags_normalized'>>
): Promise<MasterlistImage> {
  // 1. Fetch current masterlist
  const masterlist = await fetchMasterlist();
  
  // 2. Find and update the image
  const imageIndex = masterlist.images.findIndex(img => img.id === imageId);
  if (imageIndex === -1) {
    throw new Error(`Image ${imageId} not found in masterlist`);
  }
  
  const image = masterlist.images[imageIndex];
  
  // Apply updates
  if (updates.image_type !== undefined) image.image_type = updates.image_type;
  if (updates.user_rating !== undefined) image.user_rating = updates.user_rating;
  if (updates.user_notes !== undefined) image.user_notes = updates.user_notes;
  if (updates.is_favorite !== undefined) image.is_favorite = updates.is_favorite;
  if (updates.categories !== undefined) image.categories = updates.categories;
  if (updates.framework_concepts !== undefined) image.framework_concepts = updates.framework_concepts;
  if (updates.tags_normalized !== undefined) image.tags_normalized = updates.tags_normalized;
  
  // 3. Save masterlist
  await saveMasterlist(masterlist);
  
  // 4. Sync to database
  await syncImageToDatabase(image);
  
  return image;
}

// Full resync: rebuild database from masterlist
export async function fullResyncFromMasterlist(): Promise<{
  total: number;
  synced: number;
  errors: number;
}> {
  const masterlist = await fetchMasterlist();
  const supabase = getServiceClient();
  
  let synced = 0;
  let errors = 0;
  
  // Process in batches for better performance
  const batchSize = 50;
  
  for (let i = 0; i < masterlist.images.length; i += batchSize) {
    const batch = masterlist.images.slice(i, i + batchSize);
    
    const rows = batch.map(image => ({
      id: image.id,
      file_name: image.file_name,
      folder_name: image.folder_name,
      title: image.analysis?.text_title || image.file_name?.replace(/^\d+_/, '').replace(/\.png$/, '').replace(/_/g, ' '),
      image_url: image.supabase_url,
      image_type: image.image_type || 'problem',
      categories: image.categories || [],
      framework_concepts: image.framework_concepts || [],
      tags_normalized: image.tags_normalized || image.analysis?.tags || [],
      user_rating: image.user_rating,
      user_notes: image.user_notes,
      is_favorite: image.is_favorite || false,
    }));
    
    const { error } = await supabase
      .from('image_embeddings')
      .upsert(rows, { onConflict: 'id' });
    
    if (error) {
      errors += batch.length;
      console.error(`Batch error at ${i}:`, error.message);
    } else {
      synced += batch.length;
    }
  }
  
  return {
    total: masterlist.images.length,
    synced,
    errors
  };
}

// Get database counts for verification
export async function getDatabaseCounts(): Promise<Record<string, number>> {
  const supabase = getServiceClient();
  
  const { data, error } = await supabase
    .from('image_embeddings')
    .select('image_type');
  
  if (error) {
    throw new Error(`Failed to get counts: ${error.message}`);
  }
  
  const counts: Record<string, number> = {};
  for (const row of data || []) {
    const type = row.image_type || 'null';
    counts[type] = (counts[type] || 0) + 1;
  }
  
  return counts;
}

