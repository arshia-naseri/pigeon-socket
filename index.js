const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://admin.socket.io",
      "http://localhost:3000",
      "https://arshia-naseri.github.io/pigeon_chat_client_2.0/",
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // console.log("Connected id:", socket.id);

  socket.on("send_message", (from, time, text, roomID) => {
    socket.to(roomID).emit("receive_message", { from, time, text, roomID });
  });

  socket.on("join-room", (roomList) => {
    // console.log(roomList);
    socket.join(roomList);
  });
});

instrument(io, { auth: false, mode: "development" });

httpServer.listen(5050);
