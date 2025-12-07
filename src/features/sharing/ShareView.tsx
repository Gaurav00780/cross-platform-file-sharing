import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Share2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';

interface ShareViewProps {
    fileId: string;
    fileName: string;
    peerStatus?: 'disconnected' | 'connecting' | 'connected';
}

export const ShareView: React.FC<ShareViewProps> = ({ fileId, fileName, peerStatus }) => {
    const [copied, setCopied] = React.useState(false);


    // Construct the download URL using hostname to support mobile access
    const shareUrl = `${window.location.protocol}//${window.location.host}/d/${fileId}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };



    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-auto bg-white dark:bg-card rounded-2xl shadow-lg border border-gray-100 dark:border-border overflow-hidden"
        >
            <div className="p-6 text-center border-b border-gray-100 dark:border-border bg-gray-50 dark:bg-muted/50">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                    <Share2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-foreground">Ready to Share!</h2>
                <p className="text-sm text-gray-500 dark:text-muted-foreground mt-1 truncate px-4">{fileName}</p>
            </div>

            <div className="p-8 flex flex-col items-center space-y-6">
                <div className="p-4 bg-white rounded-xl shadow-sm">
                    <QRCodeSVG value={shareUrl} size={200} level="H" />
                </div>
                <p className="text-xs text-center text-gray-500 dark:text-muted-foreground font-medium">
                    📱 Scan to share link on mobile
                </p>

                <div className="w-full space-y-2">
                    <label className="text-xs font-medium text-gray-500 dark:text-muted-foreground uppercase tracking-wider">Share Link</label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="flex-1 block w-full rounded-lg border-gray-300 dark:border-input bg-gray-50 dark:bg-secondary px-4 py-2 text-sm text-gray-900 dark:text-foreground focus:border-primary focus:ring-primary"
                        />
                        <Button onClick={copyToClipboard} variant="outline" className="px-3 border-gray-300 dark:border-input hover:bg-gray-100 dark:hover:bg-accent">
                            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-500 dark:text-foreground" />}
                        </Button>
                    </div>

                </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-muted/50 text-center text-xs text-gray-400 dark:text-muted-foreground">
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${peerStatus === 'connected' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    <span>{peerStatus === 'connected' ? 'P2P Active (Direct Transfer)' : 'Waiting for peer...'}</span>
                </div>
                Scan with camera to download on mobile
            </div>
        </motion.div>
    );
};
