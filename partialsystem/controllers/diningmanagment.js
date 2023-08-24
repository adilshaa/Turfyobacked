const foodModel = require("../models/foods");
const Restaurnt = require("../../mainsystem/models/restaurants");
const Staff = require("../models/staffs");
const Tables = require("../models/tables");

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Order = require("../models/orders");
const { default: mongoose } = require("mongoose");
const Food = require("../models/foods");
const Table = require("../models/tables");
const FoodCategory = require("../models/food-category");
let secretkey = process.env.RES_DINING_TOKEN;
const DiningController = {
  async Login(req, res) {
    try {
      if (!req.body)
        return res.status(404).send({ message: "Resourses are not found" });
      const { email, password } = req.body;
      const retriveStaff = await Staff.findOne({ email: email }).exec();
      if (!retriveStaff)
        return res.status(404).send({ message: "Email is incorrect" });
      if (retriveStaff.email != email)
        return res.status(404).send({ message: "This email is invalid" });
      let encodePas = await bcrypt.compare(password, retriveStaff.password);
      if (!encodePas)
        return res.status(404).send({ message: "Password is incorrect" });

      const { _id, resturantId } = retriveStaff.toJSON();
      const payload = {
        id: _id,
        resId: resturantId,
      };
      const gernerateToken = jwt.sign(payload, secretkey, { expiresIn: "1h" });
      if (!gernerateToken)
        return res.status(400).send({ message: "your not authenticated " });
      const updateStaff = await Staff.updateOne(
        {
          _id: _id,
        },
        { $set: { status: true } }
      );
      if (!updateStaff)
        return res.status(400).send({ message: "your not authenticated " });
      const resData = await Restaurnt.findOne({
        _id: retriveStaff.resturantId,
      });
      if (!resData)
        return res.status(400).send({ message: "Your not a staff" });
      if (resData.status != true)
        return res.status(400).send({ message: "Restaurant Not opened" });
      res.send({
        resId: resData._id,
        token: gernerateToken,
        message: "success",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "Somthing went worng" });
    }
  },

  async verifyStaff(req, res) {
    try {
      const { id, resId } = req.Staff;
      if ((!id, !resId))
        return res.status(400).send({ message: "Your Not authenticated" });
      const cheakRestatus = await Restaurnt.findOne({
        _id: resId,
        status: true,
      }).exec();
      if (!cheakRestatus)
        return res.status(400).send({ message: "Restaurant is clossed" });

      res.send({ message: "success" });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Somthing went worng" });
    }
  },

  async fetchFoodsData(req, res) {
    try {
      const fetchData = await foodModel
        .find({ status: true })
        .sort({ status: 1 })
        .exec();

      if (!fetchData)
        return res.status(404).send({ message: " still processing" });
      res.send(fetchData);
    } catch (error) {
      console.log(error);
      res.status(404).send({
        message: "worng",
      });
    }
  },

  async loadTables(req, res) {
    try {
      const { id, resId } = req.Staff;

      const tables = await Tables.find({ restaurant_id: resId });

      if (tables) res.send({ tables: tables });
    } catch (error) {
      res.status(404).send({
        message: "worng",
      });
    }
  },
  async orderFood(req, res) {
    try {
      console.log("reached");
      const { resId, id } = req.Staff;
      const orderedItem = req.body.orders;
      const table_id = req.body.table;
      const orderid = crypto.randomBytes(8).toString("hex").toUpperCase();

      let foodIds = [];

      let totalAmount = 0;

      foodIds = orderedItem.map((item) => ({
        food_id: item.foodId,
        note: item.foodNote,
        food_quantity: item.foodQuantity,
        food_totalprice: item.foodQuantity * item.foodPrice,
      }));

      orderedItem.map((item) => {
        totalAmount = totalAmount + item.foodPrice * item.foodQuantity;
      });
      orderedItem.map(async (data) => {
        let foodId = data.foodId;
        let foodQuantity = data.foodQuantity;
        console.log(foodQuantity);

        const existingFood = await Food.findById(foodId);
        existingFood.stock = existingFood.stock - foodQuantity;
        if (existingFood.stock < 0) {
          existingFood.stock = 0;
        }
        await existingFood.save();
      });
      const save_Order = new Order({
        tableId: table_id,
        staffId: id,
        resId: resId,
        foods: foodIds,
        orderId: orderid,
        total_price: totalAmount,
        order_status: "pending",
      });
      let orderResult = await save_Order.save();
      if (!orderResult)
        return res.status(400).send({ message: "Order didn't recieved" });

      let chageTableStatus = await Table.updateOne(
        { _id: table_id },
        { $set: { table_status: true } }
      );
      if (!chageTableStatus)
        return res.status(400).send({ message: "Order didn't recieved" });
      res.send({ message: true });
    } catch (error) {
      console.log(error);
    }
  },
  async getOrders(req, res) {
    try {
      const { resId, id } = req.Staff;
      const Orders = await Order.find({ resId: resId })
        .populate("resId", null, Restaurnt)
        .populate("tableId", null, Tables)
        .populate("foods.food_id", null, Food)
        .exec();
      if (!Orders)
        return res.status(400).send({ message: "Order data not recieved" });
      res.send({ orders: Orders });
    } catch (error) {
      console.log(error);
    }
  },
  async filterFoods(req, res) {
    try {
      const { id } = req.params;
      let restuarant = req.Staff.resId;
      const filterdData = await Food.find({
        stock: { $gt: 0 },
        resturantId: restuarant,
        category: id,
      })
        .populate("category", null, FoodCategory)
        .populate("resturantId", null, Restaurnt)
        .exec();
      const count = await Food.countDocuments({
        resturantId: restuarant,
        category: id,
      });
      // console.log(filterdData);
      res.send({ food: filterdData, count: count });
    } catch (error) {
      console.log(error);
    }
  },
  async updateServeStatus(req, res) {
    try {
      const { id } = req.params;
      const SaveResult = await Order.updateOne(
        { _id: id },
        { $set: { order_status: "served" } }
      ).exec();
      if (!SaveResult)
        return res
          .status(400)
          .send({ message: "Somthing went worng Please try angain" });

      res.send({ message: true });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Somthing went worng" });
    }
  },
  async logout(req, res) {
    try {
      const { id } = req.Staff;

      const updateStatus = await Staff.updateOne(
        { _id: id },
        { $set: { status: false } }
      ).exec();
      if (!updateStatus)
        return res.status(400).send({ message: "Status Not upated" });
      req.Staff = null;
      res.send({ message: "sucess" });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Somthing went worng" });
    }
  },
};
module.exports = DiningController;
