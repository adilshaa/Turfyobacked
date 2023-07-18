const jwt = require("jsonwebtoken");
const secretKey = "ResturantAdminkey";
const dinigSecret = "DinigSecret";
const resAdmintokenVerify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json("You are not authenticated");

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json("You are not authenticated");
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(401).json("Invalid token");
    req.restuarant = user;
    next();
  });
};

const dinigStaffsVerify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json("You are not authenticated");
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json("You are not authenticated");
  jwt.verify(token, dinigSecret, (err, staff) => {
    if (err) return res.status(401).json("Your not authenticated");
    req.Staff = staff;
    next();
  });
};

module.exports = {
  resAdmintokenVerify,
  dinigStaffsVerify,
};
