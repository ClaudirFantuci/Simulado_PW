import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.client = null;
        this.connected = false;
    }

    connect(onMessageCallback) {
        const socket = new SockJS('http://localhost:8080/ws-reservas');

        this.client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: () => {
                console.log('WebSocket conectado!');
                this.connected = true;

                this.client.subscribe('/topic/reservas', (message) => {
                    const notificacao = JSON.parse(message.body);
                    console.log('Notificação recebida:', notificacao);
                    onMessageCallback(notificacao);
                });
            },

            onStompError: (frame) => {
                console.error('Erro STOMP:', frame);
                this.connected = false;
            },

            onWebSocketClose: () => {
                console.log('WebSocket desconectado');
                this.connected = false;
            },
        });

        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.connected = false;
            console.log('WebSocket desconectado manualmente');
        }
    }

    isConnected() {
        return this.connected;
    }
}

export default new WebSocketService();