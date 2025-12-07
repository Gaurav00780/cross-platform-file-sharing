import { useState, useEffect, useRef } from 'react';
import SimplePeer, { type Instance as PeerInstance } from 'simple-peer';
import { updateSignalingData, listenToSignalingData } from '../services/db';

// This is a simplified P2P implementation using Supabase for signaling
export const usePeer = (fileId: string | null, isInitiator: boolean) => {
    const [peerStatus, setPeerStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [receivedData, setReceivedData] = useState<any[]>([]);
    const peerRef = useRef<PeerInstance | null>(null);

    useEffect(() => {
        if (!fileId) return;

        // Cleanup function
        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
            }
        };
    }, [fileId]);

    const startP2P = () => {
        if (!fileId) return;
        setPeerStatus('connecting');

        const peer = new SimplePeer({
            initiator: isInitiator,
            trickle: false, // Simplify signaling for now
        });

        peerRef.current = peer;

        peer.on('signal', async (data: any) => {
            // Save signal to Firestore
            try {
                if (isInitiator) {
                    await updateSignalingData(fileId, { offer: JSON.stringify(data) });
                } else {
                    await updateSignalingData(fileId, { answer: JSON.stringify(data) });
                }
            } catch (err) {
                console.error("Error sending signal:", err);
            }
        });

        peer.on('connect', () => {
            console.log('P2P Connected');
            setPeerStatus('connected');
        });

        peer.on('data', (data: any) => {
            // Handle incoming data (chunks of file)
            console.log('Received data chunk');
            setReceivedData(prev => [...prev, data]);
        });

        peer.on('error', (err: any) => {
            console.error('Peer error:', err);
            setPeerStatus('disconnected');
        });

        // Listen for remote signals
        const unsubscribe = listenToSignalingData(fileId, (data) => {
            if (isInitiator && data.answer && !peer.connected) {
                peer.signal(JSON.parse(data.answer));
            } else if (!isInitiator && data.offer && !peer.connected) {
                peer.signal(JSON.parse(data.offer));
            }
        });

        return () => {
            unsubscribe();
        };
    };

    const sendFile = (file: File) => {
        if (peerRef.current && peerStatus === 'connected') {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result && peerRef.current) {
                    peerRef.current.send(reader.result as ArrayBuffer);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return { peerStatus, startP2P, sendFile, receivedData };
};
