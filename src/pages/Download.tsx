import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFileRecord, incrementDownloadCount, type FileMetadata } from '../services/db';
import { Layout } from '../components/Layout';
import { DownloadView } from '../features/download/DownloadView';
import { usePeer } from '../hooks/usePeer';

export const Download: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [fileData, setFileData] = useState<FileMetadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { startP2P, peerStatus, receivedData } = usePeer(id || null, false);

    useEffect(() => {
        const fetchFile = async () => {
            if (!id) return;
            try {
                const data = await getFileRecord(id);

                if (data) {
                    setFileData(data);
                    // Start P2P connection attempt
                    startP2P();
                } else {
                    setError('File not found or has expired.');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load file.');
            } finally {
                setLoading(false);
            }
        };

        fetchFile();
    }, [id]);

    useEffect(() => {
        if (receivedData.length > 0 && fileData) {
            // Reconstruct file from chunks
            const blob = new Blob(receivedData, { type: fileData.type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileData.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }, [receivedData, fileData]);

    const handleDownload = async () => {
        if (fileData?.downloadUrl && id) {
            // Increment download count
            try {
                await incrementDownloadCount(id);
                // Update local state to reflect the new count
                setFileData(prev => prev ? { ...prev, downloadCount: (prev.downloadCount || 0) + 1 } : prev);
            } catch (err) {
                console.error('Failed to increment download count:', err);
            }

            // Trigger download
            window.open(fileData.downloadUrl, '_blank');
        }
    };

    return (
        <Layout>
            <div className="py-12">
                {loading ? (
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading file info...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-destructive bg-destructive/10 p-8 rounded-xl max-w-md mx-auto">
                        <h3 className="text-lg font-bold mb-2">Error</h3>
                        <p>{error}</p>
                    </div>
                ) : (
                    <div>
                        {peerStatus === 'connected' && (
                            <div className="max-w-md mx-auto mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-center text-sm border border-green-100 dark:border-green-800">
                                ⚡ P2P Connection Active. Direct transfer available.
                            </div>
                        )}
                        {fileData && <DownloadView fileData={fileData} onDownload={handleDownload} />}
                    </div>
                )}
            </div>
        </Layout>
    );
};
