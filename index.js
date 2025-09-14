import { Server } from 'socket.io';
import http from 'http';

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    // origin: ["http://game.4277089-mj96801.twc1.net",
    //         "http://localhost:5174",
    //         "http://176.124.200.95:5174"], 
    // methods: ["GET", "POST"],
    origin: "*",
    methods:["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["*"],
    credentials: false
  }
});

let cards = [
  { id: "1", x: 100, y: 100, type: "nishchiy" },
  { id: "2", x: 250, y: 100, type: "bogach"   },
  { id: "3", x: 250, y: 100, type: "bogach"   },
  { id: "4", x: 400, y: 100, type: "nishchiy" },
];

io.on('connection', (socket) => {
   socket.emit('cardsUpdate', cards);

   socket.on('moveSingleCard', ({ id, x, y }) => {
    cards = cards.map(card => card.id === id ? { ...card, x, y } : card);
    io.emit('cardsUpdate', cards);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

httpServer.listen(3001, '0.0.0.0', () => {
  console.log('Server running on port 3001');
});