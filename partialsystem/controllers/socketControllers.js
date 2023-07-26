const Food = require("../models/foods");
const dinigSecret = "DinigSecret";
const jwt = require("jsonwebtoken");
const Order = require("../models/orders");
const Restaurnt = require("../../mainsystem/models/restaurants");
const Staff = require("../models/staffs");
const Tables = require("../models/tables");
module.exports = async (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket) => {
    console.log("Socket Connected With  :=> " + socket.id);

    socket.on("listFoods", async (id) => {
      let data = await Food.find({ stock: { $gt: 0 } }).sort({
        status: 1,
      });
      io.emit("showFoods", data);
    });

    socket.on("notification", () => io.emit("foodAddes"));
    
    socket.on("loadOrders", async (id) => {
      let orderData = await Order.find({ resId: id })
        .populate("resId", null, Restaurnt)
        .populate("tableId", null, Tables)
        .populate("foods.food_id", null, Food)
        .exec();
      io.emit("listOrder", orderData);
    });
  });
};
