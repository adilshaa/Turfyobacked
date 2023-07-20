const Food = require("../models/foods");
const dinigSecret = "DinigSecret";
const jwt = require("jsonwebtoken");

module.exports = async (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket) => {
    let restaurantId;
    console.log("Socket Connected With  :=> " + socket.id);

    socket.on("listFoods", async (id) => {
      console.log(id);
      let data = await Food.find({resturantId:id, status: true }).sort({
        status: 1,
      });
      io.emit("showFoods", data);
    });
  });
};
