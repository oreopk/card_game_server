const http = require("http");
const { Server } = require("socket.io");

const DEFAULT_CARDS = [
  { id: "1", x: 100, y: 100, type: "nishchiy" },
  { id: "2", x: 250, y: 100, type: "bogach"   },
  { id: "3", x: 400, y: 100, type: "bogach"   },
  { id: "4", x: 550, y: 100, type: "nishchiy" },
];

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["*"],
    credentials: false,
  },
});

const rooms = new Map();

function getRoomCards(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, DEFAULT_CARDS.map(c => ({ ...c })));
  }
  return rooms.get(roomId);
}

io.on("connection", (socket) => {
  let currentRoom = null;

  socket.on("joinRoom", (roomId) => {
    if (typeof roomId !== "string" || !roomId.trim()) return;

    if (currentRoom) socket.leave(currentRoom);
    currentRoom = roomId.trim();
    socket.join(currentRoom);

    socket.emit("cardsUpdate", getRoomCards(currentRoom));
  });

  socket.on("requestCards", () => {
    if (!currentRoom) return;
    socket.emit("cardsUpdate", getRoomCards(currentRoom));
  });

  socket.on("moveSingleCard", ({ id, x, y }) => {
    if (!currentRoom) return;

    const cards = getRoomCards(currentRoom);
    const i = cards.findIndex(c => c.id === id);
    if (i === -1) return;

    cards[i] = { ...cards[i], x, y };
    io.to(currentRoom).emit("cardsUpdate", cards);
  });

  socket.on("disconnect", async () => {
    if (!currentRoom) return;
    const sockets = await io.in(currentRoom).fetchSockets();
    if (sockets.length === 0) rooms.delete(currentRoom);
  });
});

httpServer.listen(3001, "0.0.0.0", () => {
  console.log("Server running on port 3001");
});
