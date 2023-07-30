const Food = require("../models/foods");
const dinigSecret = "DinigSecret";
const jwt = require("jsonwebtoken");
const Order = require("../models/orders");
const Restaurnt = require("../../mainsystem/models/restaurants");
const Staff = require("../models/staffs");
const Tables = require("../models/tables");
const FoodCategory = require("../models/food-category");
module.exports = async (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket) => {
    socket.on("listFoods", async (id) => {
      let data = await Food.find({ stock: { $gt: 0 } }).sort({
        status: 1,
      });
      let category = await FoodCategory.find({}).exec();
      io.emit("showFoods", { fooddata: data, category: category });
    });

    socket.on("notification", () => io.emit("foodAddes"));

    socket.on("loadOrders", async (id) => {
      let orderData = await Order.find({ resId: id, cooking_Status: false })
        .populate("resId", null, Restaurnt)
        .populate("tableId", null, Tables)
        .populate("foods.food_id", null, Food)
        .exec();
      io.emit("listOrder", orderData);
      console.log(orderData);
    });
  });
};
