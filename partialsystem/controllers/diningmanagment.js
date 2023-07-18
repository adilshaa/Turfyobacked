const foodModel = require("../models/foods");
const Restaurnt = require("../../mainsystem/models/restaurants");
const Staff = require("../models/staffs");
const Tables = require("../models/tables");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
        return res.status(400).send({ message: "your not authenticated 3" });
      const resData = await Restaurnt.findOne({
        _id: retriveStaff.resturantId,
      });
      if (!resData)
        return res.status(400).send({ message: "your not authenticated 3" });
      if (resData.status != true)
        return res.status(400).send({ message: "Restaurant Not opened" });
      res.send({
        resdata: resData,
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
};
module.exports = DiningController;
