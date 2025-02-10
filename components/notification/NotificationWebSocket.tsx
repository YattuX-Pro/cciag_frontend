'use client'

import { AuthActions } from '@/app/(auth)/utils';
import { toast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';


export default function NotificationWebSocket() {
    // const { getToken } = AuthActions();
    // const token = getToken("access");
    // const ws = useRef<WebSocket | null>(null);

    // useEffect(() => {
    //     const wsUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('http', 'ws');
    //     ws.current = new WebSocket(`${wsUrl}/notifications/`);

    //     ws.current.onopen = () => {
    //         // console.log('Connected to notifications');
    //         if (token && ws.current) {
    //             ws.current.send(JSON.stringify({ token }));
    //         }
    //     };

    //     ws.current.onmessage = (event) => {
    //         const data = JSON.parse(event.data);
    //         // toast({
    //         //     title: 'Nouvelle notification',
    //         //     description: 'Nouvelle notification reçue.'
    //         //   })
            

    //         switch(data.type) {
    //             case 'NEW_MESSAGE':
    //                 break;
    //             case 'NEW_LIKE':
    //                 break;
    //         }
    //     };

    //     ws.current.onerror = (error) => {
    //         console.error('WebSocket error:', error);
    //         // toast({
    //         //     title: 'Erreur de connexion aux notifications',
    //         //     description: 'Erreur de connexion aux notifications.',
    //         //     variant: 'destructive'
    //         //   })
    //     };



    //     return () => {
    //         if (ws.current) {
    //             ws.current.close();
    //         }
    //     };
    // }, [token]);

    return null;
}