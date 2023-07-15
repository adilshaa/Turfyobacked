const foodsModel = require("../models/foods");
module.exports = async (server) => {
  const socket = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  socket.on("connection", async (socket) => {
    async function getfoods() {
      let data = await foodsModel.find({});
      console.log("Socket Connected With  :=> " + socket.id);
      socket.emit("hello", {
        date: data,
      });
    }
  module.exports =  {getfoods} ;

  });
};
