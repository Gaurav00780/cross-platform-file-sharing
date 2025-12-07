import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { FileUpload } from '../features/upload/FileUpload';
import { ShareView } from '../features/sharing/ShareView';
import { useFileUpload } from '../hooks/useFileUpload';
import { usePeer } from '../hooks/usePeer';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Smartphone } from 'lucide-react';

export const Home: React.FC = () => {
    const { uploadFile, uploadState } = useFileUpload();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const { startP2P, peerStatus } = usePeer(uploadState.fileId, true);
    const [searchParams] = useSearchParams();
    const channelId = searchParams.get('channel');

    useEffect(() => {
        if (uploadState.fileId) {
            startP2P();

            // If we are in a transfer session (channelId exists), notify the receiver
            if (channelId) {
                const channel = supabase.channel(`transfer-${channelId}`);
                channel.subscribe((status) => {
                    if (status === 'SUBSCRIBED') {
                        channel.send({
                            type: 'broadcast',
                            event: 'file-uploaded',
                            payload: { fileId: uploadState.fileId }
                        });
                    }
                });
            }
        }
    }, [uploadState.fileId, channelId]);

    const handleFilesSelected = async (files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            setUploadedFile(file);
            await uploadFile(file);
        }
    };

    return (
        <Layout>
            <div className="text-center mb-12 space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                    Share files <span className="text-primary">instantly</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Secure, cross-device file sharing. No login required.
                    Files expire automatically.
                </p>

                {!channelId && (
                    <div className="pt-4">
                        <Link
                            to="/receive"
                            className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-full"
                        >
                            <Smartphone className="w-4 h-4" />
                            <span>Receive from Phone</span>
                        </Link>
                    </div>
                )}
            </div>

            <div className="max-w-xl mx-auto">
                {channelId && !uploadState.fileId && !uploadState.isUploading && (
                    <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex items-center space-x-3 text-blue-700 dark:text-blue-300">
                        <Smartphone className="w-5 h-5 animate-pulse" />
                        <p className="text-sm font-medium">Connected to PC. Select a file to send.</p>
                    </div>
                )}

                {uploadState.isUploading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-card p-8 rounded-xl shadow-sm border border-border text-center space-y-4"
                    >
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                        <h3 className="text-lg font-medium text-foreground">Uploading {uploadedFile?.name}...</h3>
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-300"
                                style={{ width: `${uploadState.progress}%` }}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">{Math.round(uploadState.progress)}%</p>
                    </motion.div>
                ) : uploadState.fileId ? (
                    <ShareView
                        fileId={uploadState.fileId}
                        fileName={uploadedFile?.name || 'File'}
                        peerStatus={peerStatus}
                        directDownloadUrl={uploadState.downloadUrl || undefined}
                    />
                ) : (
                    <FileUpload onFilesSelected={handleFilesSelected} />
                )}

                {uploadState.error && (
                    <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm text-center">
                        Error: {uploadState.error}
                    </div>
                )}
            </div>

            {!uploadState.fileId && !uploadState.isUploading && (
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
                    <div className="p-6 bg-card rounded-xl shadow-sm border border-border">
                        <div className="text-3xl mb-4">🔒</div>
                        <h3 className="font-bold text-foreground mb-2">Secure</h3>
                        <p className="text-muted-foreground text-sm">End-to-end encryption for direct transfers. Password protection available.</p>
                    </div>
                    <div className="p-6 bg-card rounded-xl shadow-sm border border-border">
                        <div className="text-3xl mb-4">⚡</div>
                        <h3 className="font-bold text-foreground mb-2">Fast</h3>
                        <p className="text-muted-foreground text-sm">Peer-to-peer technology for maximum speed on local networks.</p>
                    </div>
                    <div className="p-6 bg-card rounded-xl shadow-sm border border-border">
                        <div className="text-3xl mb-4">📱</div>
                        <h3 className="font-bold text-foreground mb-2">Cross-Device</h3>
                        <p className="text-muted-foreground text-sm">Seamlessly share between desktop and mobile via QR code.</p>
                    </div>
                </div>
            )}
        </Layout>
    );
};
