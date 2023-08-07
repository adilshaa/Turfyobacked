const jwt = require("jsonwebtoken");
const Ressecret = process.env.RES_ADMIN_TOKEN;
const dinigSecret = process.env.RES_DINING_TOKEN;
let KitchenSecret = process.env.RES_KTCHEN_TOKEN;
const posSecret = process.env.RES_POS_TOKEN;
require("dotenv").config();
const resAdmintokenVerify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json("You are not authenticated");
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json("You are not authenticated");
  jwt.verify(token, Ressecret, (err, user) => {
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

const verifyKitchenStaffs = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json("You are not authenticated");
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json("You are not authenticated");
  jwt.verify(token, KitchenSecret, (err, staff) => {
    if (err) return res.status(401).json("Your not authenticated");
    req.Staff = staff;
    next();
  });
};

const verifyPos = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json("You are not authenticated");
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json("You are not authenticated");
  jwt.verify(token, posSecret, (err, staff) => {
    if (err) return res.status(401).json("Your not authenticated");
    req.Staff = staff;
    next();
  });
};

module.exports = {
  resAdmintokenVerify,
  dinigStaffsVerify,
  verifyKitchenStaffs,
  verifyPos,
};
