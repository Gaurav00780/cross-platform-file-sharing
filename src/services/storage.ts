import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from 'uuid';

export const uploadFile = async (
    file: File,
    onProgress?: (progress: number) => void
): Promise<{ downloadUrl: string; storagePath: string }> => {
    const storageId = uuidv4();
    const storagePath = `${storageId}/${file.name}`;

    // Supabase Storage doesn't have a built-in progress listener in the simple upload method
    // But we can use the TUS protocol if we want resumable uploads, or just simple upload.
    // For simplicity in this migration, we'll use simple upload and simulate progress or just set to 100 at end.
    // To support progress, we would need to use TUS or XMLHttpRequest with the URL.
    // Supabase JS client v2 upload doesn't expose progress easily yet without TUS.
    // Let's just do a simple upload for now.

    const { error } = await supabase.storage
        .from('uploads')
        .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        throw error;
    }

    if (onProgress) onProgress(100);

    // Get the public URL for viewing
    const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(storagePath);

    // Create a download URL that forces download instead of preview
    // Supabase supports adding ?download query parameter to force download
    const downloadUrl = `${publicUrl}?download=${encodeURIComponent(file.name)}`;

    return {
        downloadUrl: downloadUrl,
        storagePath: storagePath
    };
};

export const deleteFile = async (storagePath: string): Promise<void> => {
    const { error } = await supabase.storage
        .from('uploads')
        .remove([storagePath]);

    if (error) {
        throw error;
    }
};
