export default function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);

    socket.on("setup", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
      socket.emit("connected");
    });

    socket.on("join chat", (chatUserId) => {
      socket.join(chatUserId);
      console.log(`Socket joined chat room ${chatUserId}`);
    });

    socket.on("new message", (newMessage) => {
      io.to(newMessage.receiver).emit("message received", newMessage);
      io.to(newMessage.sender).emit("message received", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected", socket.id);
    });
  });
}
