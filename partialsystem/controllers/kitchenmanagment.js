const Food = require("../models/foods");
const Restaurnt = require("../../mainsystem/models/restaurants");
const Staff = require("../models/staffs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let secretkey = "KitchenSecret";
const KitcheController = {
  async fetcheFoods(req, res) {
    try {
      const fetchData = await Food.find({}).sort({ status: -1 });
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
      let status = req.body.status;

      const listResult = await Food.updateOne(
        { _id: id },
        { $set: { status: status } }
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
};

module.exports = KitcheController;


