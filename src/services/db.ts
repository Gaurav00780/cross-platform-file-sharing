import { supabase } from "../lib/supabase";

export interface FileMetadata {
    id?: string;
    name: string;
    size: number;
    type: string;
    downloadUrl: string;
    storagePath: string;
    createdAt?: any;
    expiresAt?: any;
    downloadCount?: number;
    offer?: string;
    answer?: string;
}

export const createFileRecord = async (metadata: Omit<FileMetadata, "id" | "createdAt">): Promise<string> => {
    const { data, error } = await supabase
        .from('files')
        .insert([
            {
                name: metadata.name,
                size: metadata.size,
                type: metadata.type,
                download_url: metadata.downloadUrl,
                storage_path: metadata.storagePath,
                download_count: 0
            }
        ])
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data.id;
};

export const getFileRecord = async (id: string): Promise<FileMetadata | null> => {
    const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        return null;
    }

    return {
        id: data.id,
        name: data.name,
        size: data.size,
        type: data.type,
        downloadUrl: data.download_url,
        storagePath: data.storage_path,
        createdAt: data.created_at,
        expiresAt: data.expires_at,
        downloadCount: data.download_count,
        offer: data.offer,
        answer: data.answer
    };
};

export const updateSignalingData = async (id: string, data: { offer?: string; answer?: string }): Promise<void> => {
    const { error } = await supabase
        .from('files')
        .update(data)
        .eq('id', id);

    if (error) {
        throw error;
    }
};

export const incrementDownloadCount = async (id: string): Promise<void> => {
    // Get current count and increment
    const { data: currentFile } = await supabase
        .from('files')
        .select('download_count')
        .eq('id', id)
        .single();

    if (currentFile) {
        await supabase
            .from('files')
            .update({ download_count: (currentFile.download_count || 0) + 1 })
            .eq('id', id);
    }
};

export const listenToSignalingData = (id: string, callback: (data: FileMetadata) => void): (() => void) => {
    const channel = supabase
        .channel(`file-${id}`)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'files',
                filter: `id=eq.${id}`
            },
            (payload) => {
                const data = payload.new;
                callback({
                    id: data.id,
                    name: data.name,
                    size: data.size,
                    type: data.type,
                    downloadUrl: data.download_url,
                    storagePath: data.storage_path,
                    createdAt: data.created_at,
                    expiresAt: data.expires_at,
                    downloadCount: data.download_count,
                    offer: data.offer,
                    answer: data.answer
                });
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};
