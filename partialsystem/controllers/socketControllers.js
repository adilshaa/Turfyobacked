const foodsModel = require("../models/foods");
module.exports = async (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket) => {
    console.log("Socket Connected With  :=> " + socket.id);

    socket.on("listFoods", async () => {
      let data = await foodsModel.find({ status: true }).sort({ status: 1 });
      console.log(data);
      console.log("listing");
      io.emit("showFoods", data);
    });
  });
};
