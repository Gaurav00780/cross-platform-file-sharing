import React from 'react';
import { Download, File, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';

interface DownloadViewProps {
    fileData: {
        name: string;
        size: number;
        type: string;
        downloadUrl: string;
        downloadCount?: number;
    };
    onDownload: () => void;
}

export const DownloadView: React.FC<DownloadViewProps> = ({ fileData, onDownload }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
        >
            <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <File className="h-8 w-8 text-primary" />
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">{fileData.name}</h2>
                <p className="text-muted-foreground mb-2">
                    {(fileData.size / 1024 / 1024).toFixed(2)} MB • {fileData.type || 'Unknown type'}
                </p>
                {fileData.downloadCount !== undefined && fileData.downloadCount > 0 && (
                    <p className="text-sm text-primary font-medium">
                        📥 Downloaded {fileData.downloadCount} {fileData.downloadCount === 1 ? 'time' : 'times'}
                    </p>
                )}

                <Button onClick={onDownload} size="lg" className="w-full flex items-center justify-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Download File</span>
                </Button>
            </div>

            <div className="bg-muted/50 p-4 border-t border-border">
                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Scanned for viruses • Secure transfer</span>
                </div>
            </div>
        </motion.div>
    );
};
