import { useState } from 'react';
import { uploadFile as uploadFileService } from '../services/storage';
import { createFileRecord } from '../services/db';

export interface UploadState {
    progress: number;
    error: string | null;
    downloadUrl: string | null;
    fileId: string | null;
    isUploading: boolean;
}

export const useFileUpload = () => {
    const [uploadState, setUploadState] = useState<UploadState>({
        progress: 0,
        error: null,
        downloadUrl: null,
        fileId: null,
        isUploading: false,
    });

    const uploadFile = async (file: File) => {
        setUploadState(prev => ({ ...prev, isUploading: true, error: null, progress: 0 }));

        try {
            // 1. Upload to Storage
            const { downloadUrl, storagePath } = await uploadFileService(file, (progress) => {
                setUploadState(prev => ({ ...prev, progress }));
            });

            // 2. Create Record in Database
            const fileId = await createFileRecord({
                name: file.name,
                size: file.size,
                type: file.type,
                downloadUrl,
                storagePath,
            });

            setUploadState({
                progress: 100,
                error: null,
                downloadUrl,
                fileId,
                isUploading: false,
            });

        } catch (err: any) {
            console.error("Upload failed:", err);
            setUploadState(prev => ({ ...prev, error: err.message || "Upload failed", isUploading: false }));
        }
    };

    return { uploadFile, uploadState };
};
