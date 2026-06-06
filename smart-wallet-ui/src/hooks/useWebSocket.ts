import { Client, IFrame } from '@stomp/stompjs';
import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import type { Wallet } from '../api/types';

interface UseWebSocketOptions {
  enabled: boolean;
  username?: string;
  token?: string;
  onWalletUpdate: (wallet: Wallet) => void;
}

export const useWebSocket = ({ enabled, username, token, onWalletUpdate }: UseWebSocketOptions) => {
  const stompClient = useRef<Client | null>(null);
  const lastWalletData = useRef<string>('');

  useEffect(() => {
    if (!enabled || !username || !token) {
      if (stompClient.current?.active) {
        console.log('Deactivating WebSocket...');
        stompClient.current.deactivate();
      }
      return;
    }

    const socketUrl = 'http://localhost:8081/ws'; // Ajuster selon l'URL de l'API

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('STOMP: ' + str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame: IFrame) => {
      console.log('Connected to STOMP: ' + frame.body);
      
      const topic = `/topic/wallet/${username}`;
      client.subscribe(topic, (message) => {
        if (message.body) {
          try {
            const newWallet: Wallet = JSON.parse(message.body);
            const stringifiedData = JSON.stringify(newWallet);

            // Prévention de l'Update Storm : On ne met à jour que si les données ont réellement changé
            if (stringifiedData !== lastWalletData.current) {
              lastWalletData.current = stringifiedData;
              onWalletUpdate(newWallet);
              console.log('Real-time wallet update received:', newWallet);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message'], frame.body);
    };

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        console.log('Cleaning up WebSocket connection...');
        stompClient.current.deactivate();
      }
    };
  }, [enabled, username, token, onWalletUpdate]);

  return stompClient.current;
};
