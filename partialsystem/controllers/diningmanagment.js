const foodModel = require("../models/foods");
const Staff = require("../models/staffs");
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken")
const DiningController = {
  async Login(req, res) {
    try {
      if (!req.body)
        return res.status(404).send({ message: "Resourses are not found" });
      const { email, password } = req.body;
      const retriveStaff = await Staff.findOne({ email: email }).exec();
      if (!retriveStaff)
        return res.status(404).send({ message: "Your Not authenticated" });

      let encodePas = await bcrypt.compare(retriveStaff.password, password);
      if (!encodePas)
        return res.status(404).send({ message: "Your Not authenticated" });
      0
      
    } catch (error) {}
  },
  async fetchFoodsData(req, res) {
    console.log("am dinig");
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
    } catch (error) {}
  },
};
module.exports = DiningController;
