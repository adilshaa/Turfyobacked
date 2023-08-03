const Staff = require("../models/staffs");
const Restaurnt = require("../../mainsystem/models/restaurants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretkey = "possecret";
const posController = {
  async staffLogin(req, res) {
    try {
      if (!req.body)
        return res.status(404).send({ message: "Resourses are not found" });
      const { email, password } = req.body;
      const retriveStaff = await Staff.findOne({ email: email }).exec();
      if (!retriveStaff)
        return res.status(404).send({ message: "Email is incorrect" });
      let encodePas = await bcrypt.compare(password, retriveStaff.password);
      if (!encodePas)
        return res.status(404).send({ message: "Password is incorrect" });
      const { _id, resturantId } = retriveStaff.toJSON();
      const payload = {
        id: _id,
        resId: resturantId,
      };
      const gernerateToken = jwt.sign(payload, secretkey, {
        expiresIn: "1h",
      });
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
    }
  },
};
module.exports = posController;
