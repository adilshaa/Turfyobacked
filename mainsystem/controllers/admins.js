const adminModel = require("../models/admins");
const jwt = require("jsonwebtoken");

const superAdminLogin = async (req, res) => {
  try {
    let secretKey = "adminSecure";
    console.log("reached");
    let { name, email, number, password } = req.body;
    if (name && email && password) {
      let admindata = await adminModel.findOne({ email: email });
      if (admindata) {
        if (admindata.password === password) {
          const { _id } = admindata.toJSON();
          console.log(_id);
          
          const payload = {
            aud: _id,
          };
          const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
          console.log(token);
          // res.cookie("jwt", token, {
          //   httpOnly: true,
          //   amxAge: 24 * 60 * 60 * 1000,
          // });
          console.log("success");
          res.send({ token: token });
        } else {
          res.status(400).send({
            message: "error",
          });
        }
      }
    } else {
      res.status(400).send({
        message: "error",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
const isSuperAdmin = async (req, res) => {
  try {
    // console.log(req.headers);
    const authHeader = req.headers.authorization;
    const headertoken = authHeader && authHeader.split(" ")[1]; // Extract the token from the Authorization header
    console.log(headertoken);
    console.log("check super admin");
    const claims = jwt.verify(headertoken, secretKey);
    console.log(claims);
    // console.log(claims, +"   ", token);
    if (!claims) {
      console.log("not climed");
      return res.status(401).send({
        message: "unautheticated",
      });

      
    } else {
      console.log("calimed");
      const retrivedata = await adminModel.findOne({ _id: claims.aud });
      const { password, ...data } = await retrivedata.toJSON();
      res.send(data);
    }
  } catch (error) {
    return res.status(400).send({
      message: "Not Authondicated",
    });
  }
};
const logOutSuperAdmin = async (req, res) => {
  try {
    console.log("out");
    const authHeader = req.headers.authorization;
    const headertoken = authHeader && authHeader.split(" ")[1]; // Extract the token from the Authorization header
    const claims = jwt.verify(headertoken, "adminSecure");
    console.log(claims);
    if (claims.aud) {
      res.send({ message: "sucess" });
    } else {
      res.status(404).send({
        message:"error found"
      })
    }

  } catch (error) {
     res.status(401).send({
       message: "error found",
     });
  }
  
};
module.exports = {
  superAdminLogin,
  isSuperAdmin,
  logOutSuperAdmin,
};
