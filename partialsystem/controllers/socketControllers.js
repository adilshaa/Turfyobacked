const Food = require("../models/foods");
module.exports = async (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket) => {
    console.log("Socket Connected With  :=> " + socket.id);

    socket.on("listFoods", async () => {
      let data = await Food.find({ status: true }).sort({ status: 1 });
      io.emit("showFoods", data);
    });
  });
};
