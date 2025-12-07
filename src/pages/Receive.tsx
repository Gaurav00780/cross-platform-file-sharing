import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { Layout } from '../components/Layout';
import { Smartphone, Monitor, ArrowRight } from 'lucide-react';

export const Receive: React.FC = () => {
    const navigate = useNavigate();
    const [channelId, setChannelId] = useState<string>('');
    const [status, setStatus] = useState<'waiting' | 'connected' | 'transferring'>('waiting');

    useEffect(() => {
        const newChannelId = uuidv4();
        setChannelId(newChannelId);

        const channel = supabase.channel(`transfer-${newChannelId}`);

        channel
            .on('broadcast', { event: 'file-uploaded' }, ({ payload }) => {
                console.log('Received file upload notification:', payload);
                if (payload.fileId) {
                    setStatus('transferring');
                    // Small delay to show success state
                    setTimeout(() => {
                        navigate(`/d/${payload.fileId}`);
                    }, 1000);
                }
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Listening for transfers on channel:', newChannelId);
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [navigate]);

    const transferUrl = channelId
        ? `${window.location.origin}/?channel=${channelId}`
        : '';

    return (
        <Layout>
            <div className="max-w-2xl mx-auto text-center py-12">
                <h1 className="text-3xl font-bold text-foreground mb-4">
                    Receive from Phone
                </h1>
                <p className="text-muted-foreground mb-12">
                    Scan the QR code with your phone to send files directly to this computer.
                </p>

                <div className="bg-card p-8 rounded-2xl shadow-sm border border-border inline-block mb-12">
                    {channelId ? (
                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 inline-block">
                                <QRCodeSVG
                                    value={transferUrl}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground font-mono bg-muted py-2 px-4 rounded-lg">
                                Channel: {channelId.slice(0, 8)}
                            </p>
                        </div>
                    ) : (
                        <div className="w-64 h-64 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center space-x-8 text-muted-foreground">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-foreground">Your Phone</span>
                    </div>

                    <ArrowRight className="w-6 h-6 animate-pulse text-primary/30" />

                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                            <Monitor className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-foreground">This PC</span>
                    </div>
                </div>

                {status === 'transferring' && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-card p-8 rounded-2xl shadow-xl text-center border border-border">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ArrowRight className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Connecting...</h3>
                            <p className="text-muted-foreground">Redirecting to download...</p>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};
