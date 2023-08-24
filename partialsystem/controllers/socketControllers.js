const Food = require("../models/foods");
const jwt = require("jsonwebtoken");
const Order = require("../models/orders");
const Restaurant = require("../../mainsystem/models/restaurants");
const Staff = require("../models/staffs");
const Table = require("../models/tables");
const FoodCategory = require("../models/food-category");
const OrderHistory = require("../models/order_history");

module.exports = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: [
        "*",
        // "https://oxres-pos.netlify.app", // pOS application
        // "https://oxres-superadmin.netlify.app", //  super admin app
        // "https://oxres-rescontrols.netlify.app", //  restaurant control app
        // "https://oxres-pos.netlify.app", // kitchen  app
        // "https://oxres-dining.netlify.app", // dining app
      ],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected.");

    socket.on("disconnect", () => {
      console.log("A user disconnected.");
    });

    // Emit list of foods and categories
    socket.on("listFoods", async (datas) => {
      try {
        const foodData = await Food.find({
          resturantId: datas.resId,
          stock: { $gt: 0 },
        }).sort({
          stock: 1,
        });
        const categories = await FoodCategory.find({ resId: datas.resId });
        io.emit("showFoods", { foodData, categories });
      } catch (error) {
        console.error("Error while fetching food data:", error);
      }
    });
    socket.on("listFoodsandChange", async (datas) => {
      // Subscribe the socket to data changes
      try {
        const updatedData = await Food.findOne({
          _id: datas.data.id,
          resturantId: datas.resId,
        });
        io.emit("newDataAdded", updatedData);
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("NewOrders", async (data) => {
      try {
        console.log("new orders");
        let newOrder = await Order.findOne({ resId: data.resId }, {})
          .sort({ _id: -1 })
          .populate("resId", null, Restaurant)
          .populate("tableId", null, Table)
          .populate("foods.food_id", null, Food)
          .populate("staffId", null, Staff)
          .exec();
        io.emit("pushNewOrder", newOrder);
      } catch (error) {}
    });
    socket.on("foodIsReady", async (datas) => {
      console.log("update");
      try {
        let findservedOrder = await Order.findOne({
          resId: datas.resId,
          _id: datas.data.id,
        })
          .populate("resId", null, Restaurant)
          .populate("tableId", null, Table)
          .populate("foods.food_id", null, Food)
          .populate("staffId", null, Staff)
          .exec();

        io.emit("updateServedOrder", findservedOrder);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("listFoodsToKitchen", async (datas) => {
      try {
        const foodData = await Food.find({
          resturantId: datas.resId,
        }).exec();
        let availableFoods = foodData.filter((items) => items.stock > 0);
        let unavailableFoods = foodData.filter((items) => items.stock <= 0);
        console.log(unavailableFoods.length, availableFoods.length);
        const categories = await FoodCategory.find({ resId: datas.resId });
        io.emit("showFoodsinKithen", {
          foodData,
          categories,
          availableFoods,
          unavailableFoods,
        });
      } catch (error) {
        console.error("Error while fetching food data:", error);
      }
    });
    socket.on("listFoodsToResControl", async (datas) => {
      try {
        const foodData = await Food.find({
          resturantId: datas.resId,
        }).exec();
        const categories = await FoodCategory.find({ resId: datas.resId });

        io.emit("showFoodsinRescontrol", {
          foodData,
          categories,
        });
      } catch (error) {
        console.error("Error while fetching food data:", error);
      }
    });
    socket.on("filterFoodsToKitchen", async (datas) => {
      try {
        const filterdData = await Food.find({
          resturantId: datas.resId,
          category: datas.data,
        }).exec();
        io.emit("FilteredFoods", filterdData);
      } catch (error) {}
    });
    socket.on("changeTables", async (datas) => {
      try {
        let tables = await Table.find({ restaurant_id: datas.resId });
        if (!tables) return console.log("no tables");
        io.emit("updatedTables", tables);
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("loadOrderskitchenside", async (datas) => {
      try {
        const orderData = await Order.find({
          resId: datas.resId,
          order_status: "pending",
        })
          .populate("resId", null, Restaurant)
          .populate("tableId", null, Table)
          .populate("foods.food_id", null, Food)
          .populate("staffId", null, Staff)
          .exec();
        io.emit("listOrdersKitchen", orderData);
      } catch (error) {
        console.log(error);
      }
    });
    // Load different types of orders
    const loadOrders = async (datas, options) => {
      try {
        const orderData = await Order.find({ resId: datas.resId })
          .populate("resId", null, Restaurant)
          .populate("tableId", null, Table)
          .populate("foods.food_id", null, Food)
          .populate("staffId", null, Staff)
          .exec();
        io.emit("listOrders", orderData);
      } catch (error) {
        console.error("Error while loading orders:", error);
      }
    };

    socket.on("loadOrdersToPOS", async (datas) => {
      const orderData = await Order.find({ resId: datas.resId })
        .populate("resId", null, Restaurant)
        .populate("tableId", null, Table)
        .populate("foods.food_id", null, Food)
        .populate("staffId", null, Staff)
        .exec();
      io.emit("listOrdersToPOS", orderData);
    });

    socket.on("loadAllOrders", (datas) => {
      loadOrders(datas);
    });

    socket.on("loadOrdersCounter", (datas) => {
      loadOrders(datas);
    });

    // Load orders history
    socket.on("loadToOrdersHistory", async (datas) => {
      try {
        const orderData = await OrderHistory.find({ res_id: datas.resId })
          .populate("res_id", null, Restaurant)
          .populate("Ordered_table", null, Table)
          .populate("Ordered_foods.food_id", null, Food)
          .populate("order_Staff.staff_id", null, Staff)
          .exec();
        io.emit("listOrderHistories", orderData);
        // io.emit("NotifyNewOrder", true);
      } catch (error) {
        console.error("Error while loading order history:", error);
      }
    });
  });
};
