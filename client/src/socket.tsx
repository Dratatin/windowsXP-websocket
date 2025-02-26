import io from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_CORS_ORIGIN_SERVER;

export const socket = io(SERVER_URL, { autoConnect: false });
