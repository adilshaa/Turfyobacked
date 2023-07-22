const foodModel = require("../models/foods");
const Restaurnt = require("../../mainsystem/models/restaurants");
const Staff = require("../models/staffs");
const Tables = require("../models/tables");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Order = require("../models/orders");
const { default: mongoose } = require("mongoose");
let secretkey = "DinigSecret";
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
      const { resId, id } = req.Staff;
      console.log(req.body);
      const orderedItem = req.body;
      let foodIds = [];
      let tableId;
      let totalAmount=0;

      foodIds = orderedItem.map((item) => ({
        food_id: new mongoose.Types.ObjectId(item.foodId),
        note: item.foodNote,
        food_quantity: item.foodQuantity,
      }));
      tableId = orderedItem.find((id) => id.tableId);
      console.log(tableId);
      orderedItem.map((item) => {
        totalAmount = totalAmount + item.foodPrice;
      });
      const save_Order = new Order({
        tableId: new mongoose.Types.ObjectId(tableId[0]),
        staffId: new mongoose.Types.ObjectId(id),
        resId: new mongoose.Types.ObjectId(resId),
        foods: foodIds,
        total_price: totalAmount,
        order_status: true,
      });
      await save_Order.save();
      if (orderedItem) res.send({ message: true });
    } catch (error) {
      console.log(error);
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
