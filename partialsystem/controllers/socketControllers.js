const Food = require("../models/foods");
const dinigSecret = "DinigSecret";
const jwt = require("jsonwebtoken");
const Order = require("../models/orders");
const Restaurnt = require("../../mainsystem/models/restaurants");
const Staff = require("../models/staffs");
const Table = require("../models/tables");
const FoodCategory = require("../models/food-category");
const Order_history = require("../models/order_history");
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
      let orderData = await Order.find({ resId: id })
        .populate("resId", null, Restaurnt)
        .populate("tableId", null, Table)
        .populate("foods.food_id", null, Food)
        .exec();
      io.emit("listOrder", orderData);
    });
    socket.on("loadOrderskitcheside", async (id) => {
      let orderData = await Order.find({ resId: id, order_status: "pendding" })
        .populate("resId", null, Restaurnt)
        .populate("tableId", null, Table)
        .populate("foods.food_id", null, Food)
        .exec();
      io.emit("loadOrdersOnKitchen", orderData);
    });
    socket.on("loadOrders", async (id) => {
      let orderData = await Order.find({ resId: id })
        .populate("resId", null, Restaurnt)
        .populate("tableId", null, Table)
        .populate("foods.food_id", null, Food)
        .exec();
      io.emit("loadAllOrders", orderData);
    });
    socket.on("loadOrders", async (id) => {
      let orderData = await Order.find({ resId: id })
        .populate("resId", null, Restaurnt)
        .populate("tableId", null, Table)
        .populate("foods.food_id", null, Food)
        .populate("staffId", null, Staff)
        .exec();
      io.emit("loadordersToCounter", orderData);
    });
      socket.on("loadToOrdersHistory", async (id) => {
        let orderData = await Order_history.find({ res_id: id })
          .populate("res_id", null, Restaurnt)
          .populate("Ordered_table", null, Table)
          .populate("Ordered_foods.food_id", null, Food)
          .populate("order_Staff.staff_id", null, Staff)
          .exec();
        io.emit("listorderHistories", orderData,);
        io.emit('NotifyNewOrder',true)

      });
  });
};
