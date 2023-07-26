const Food = require("../models/foods");
const Restaurnt = require("../../mainsystem/models/restaurants");
const Staff = require("../models/staffs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let secretkey = "KitchenSecret";
const KitcheController = {
  async fetcheFoods(req, res) {
    try {
      const { resId } = req.Staff;
      const fetchData = await Food.find({ resturantId: resId }).sort({
        status: -1,
      });
      if (!fetchData)
        return res.status(404).send({
          message: "Datas not fetched",
        });
      res.send(fetchData);
    } catch (error) {
      console.log(error);
      res.status(401).send({
        mesage: " syntax error",
      });
    }
  },
  async listFoods(req, res) {
    try {
      let id = req.params.id;
      let stock = req.body.key;
      const TakeFood = await Food.findById(id).exec();
      if (stock == 1) {
        stock = parseInt(TakeFood.stock) + 1;
        
      } else {
        if (parseInt(TakeFood.stock) >0) {
          stock = parseInt(TakeFood.stock) - 1;
        }
      }

      const listResult = await Food.updateOne(
        { _id: id },
        { $set: { stock: stock } }
      ).exec();
      if (!listResult)
        return res.status(401).send({
          message: "Still processing",
        });
      res.send({ message: true });
    } catch (error) {
      console.log(error);
      res.status(401).send({
        message: " syntax error",
      });
    }
  },
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
        return res.status(400).send({ message: "your not authenticated 3" });
      const resData = await Restaurnt.findOne({
        _id: retriveStaff.resturantId,
      });
      if (!resData)
        return res.status(400).send({ message: "your not authenticated 3" });
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
      res.send({ message: "sucess" });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Somthing went worng" });
    }
  },
  async fetchOrders(req, res) {},
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
      return res.status(400).send({ message: "Somthing went worng" });
    }
  },
};

module.exports = KitcheController;
