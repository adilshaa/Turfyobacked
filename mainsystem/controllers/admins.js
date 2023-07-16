const adminModel = require("../models/admins");
const jwt = require("jsonwebtoken");
let secretKey = "adminSecure";

const SuperAdminController = {
  async superAdminLogin(req, res) {
    try {
      let { email, password } = req.body;
      if ((!email, !password))
        return res.status(404).send({ message: "not authenticated" });
      let admindata = await adminModel.findOne({ email: email }).exec();

      if (!admindata)
        return res.status(404).send({ message: "not authenticated" });

      if (admindata.password !== password)
        return res.status(404).send({ message: "Worng Passowrd" });

      const { _id } = admindata.toJSON();

      const payload = {
        id: _id,
      };
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

      if (!token) return res.status(404).send({ message: "not authenticated" });
      res.send({ token: token });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Sommthing went worng",
      });
    }
  },
  async isSuperAdmin(req, res) {
    try {
      // console.log(req.headers);
      const authHeader = req.headers.authorization;
      if (!authHeader)
        return res.status(404).send({ message: "not authenticated" });
      const headertoken = authHeader && authHeader.split(" ")[1]; // Extract the token from the Authorization header
      const claims = jwt.verify(headertoken, secretKey);

      if (!claims)
        return res.status(401).send({
          message: "Not Authenticated",
        });

      const retrivedata = await adminModel.findOne({ _id: claims.id }).exec();

      if (!retrivedata)
        return res.status(401).send({
          message: "Not Authenticated",
        });
      const { password, ...data } = await retrivedata.toJSON();
      res.send(data);
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Not Authondicated",
      });
    }
  },
  async logOutSuperAdmin(req, res) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader)
        return res.status(404).send({ message: "not authenticated" });

      const headertoken = authHeader && authHeader.split(" ")[1]; // Extract the token from the Authorization header

      const claims = jwt.verify(headertoken, "adminSecure");

      if (!claims)
        return res.status(404).send({ message: "not authenticated" });

      res.send({ message: "sucess" });

    } catch (error) {
      console.log(error);
      res.status(401).send({
        message: "error found",
      });
    }
  },
};

module.exports = SuperAdminController;
