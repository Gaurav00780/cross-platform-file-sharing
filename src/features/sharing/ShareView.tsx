import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Share2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';

interface ShareViewProps {
    fileId: string;
    fileName: string;
    peerStatus?: 'disconnected' | 'connecting' | 'connected';
    directDownloadUrl?: string;
}

export const ShareView: React.FC<ShareViewProps> = ({ fileId, fileName, peerStatus, directDownloadUrl }) => {
    const [copied, setCopied] = React.useState(false);
    const [copiedDirect, setCopiedDirect] = React.useState(false);

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

    const copyDirectLink = async () => {
        if (!directDownloadUrl) return;
        try {
            await navigator.clipboard.writeText(directDownloadUrl);
            setCopiedDirect(true);
            setTimeout(() => setCopiedDirect(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
            <div className="p-6 text-center border-b border-gray-100 bg-gray-50">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Share2 className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Ready to Share!</h2>
                <p className="text-sm text-gray-500 mt-1 truncate px-4">{fileName}</p>
            </div>

            <div className="p-8 flex flex-col items-center space-y-6">
                <div className="p-4 bg-white border-2 border-gray-100 rounded-xl shadow-sm">
                    <QRCodeSVG value={directDownloadUrl || shareUrl} size={200} level="H" />
                </div>
                {directDownloadUrl && (
                    <p className="text-xs text-center text-green-600 font-medium">
                        📱 QR Code → Direct Download (Works Anywhere!)
                    </p>
                )}

                <div className="w-full space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Share Link</label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="flex-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <Button onClick={copyToClipboard} variant="outline" className="px-3">
                            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>

                    {directDownloadUrl && (
                        <div className="w-full space-y-2 pt-4 border-t border-gray-100">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Direct Download Link (Works Anywhere 🌍)
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={directDownloadUrl}
                                    className="flex-1 block w-full rounded-lg border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <Button onClick={copyDirectLink} variant="outline" className="px-3">
                                    {copiedDirect ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 italic">
                                This link downloads the file directly from Supabase storage - works from any device, anywhere!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 bg-gray-50 text-center text-xs text-gray-400">
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${peerStatus === 'connected' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>{peerStatus === 'connected' ? 'P2P Active (Direct Transfer)' : 'Waiting for peer...'}</span>
                </div>
                Scan with camera to download on mobile
            </div>
        </motion.div>
    );
};
