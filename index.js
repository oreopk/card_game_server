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

let cards_container = [];

function createGrid(x, y, width, height) {
  const grid = [];
  const cellWidth = (width) / 10;
  
    for (let col = 0; col < 10; col++) {
      grid.push({
        id: `${col}`,
        x: x + col * (cellWidth),
      });
    }
  return grid;
}

cards_container.push(...createGrid(100, 50, 1000, 1100));


io.on('connection', (socket) => {
   socket.emit('cardsUpdate', cards);
   socket.emit('cardsContainerUpdate', cards_container);
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