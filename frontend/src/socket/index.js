import {io} from 'socket.io-client'

export const socketInit = () => {
    const options={
        'force new connection': true, // https://socket.io/docs/v4/client-options/#forcenew understand this shit 0-O
        'reconnectionAttempts': 'Infinity',
        'timeout': 10000,
        'transports': ['websocket', 'polling'],
    }
    const socket = io('http://localhost:5002',options)
    
    return socket
}