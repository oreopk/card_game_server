import { Server } from 'socket.io';
import http from 'http';

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://game.4277089-mj96801.twc1.net", 
    methods: ["GET", "POST"]
  }
});

let cards = [
  { id: "1", x: 100, y: 100, type: "nishchiy" },
  { id: "2", x: 250, y: 100, type: "bogach"   },
  { id: "3", x: 250, y: 100, type: "bogach"   },
  { id: "4", x: 400, y: 100, type: "nishchiy" },
];

const rooms = new Map();


function getRoomCards(roomId){
  if (!rooms.has(roomId)) {
    rooms.set(roomId, DEFAULT_CARDS.map(c => ({ ...c })));
  }
  return rooms.get(roomId);
}


io.on('connection', (socket) => {
  let currentRoom=null;

  socket.on("joinRoom", (roomId) => {
    if (!roomId) return;
    if (currentRoom) socket.leave(currentRoom);
    currentRoom = roomId;
    socket.join(currentRoom);
    socket.emit("cardsUpdate", getRoomCards(currentRoom));
  });
  
  socket.on('moveSingleCard', ({ id, x, y }) => {
    cards = cards.map(card => 
      card.id === id ? { ...card, x, y } : card
    );
    
    io.emit('cardsUpdate', cards);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

httpServer.listen(3001, '0.0.0.0', () => {
  console.log('Server running on port 3001');
});