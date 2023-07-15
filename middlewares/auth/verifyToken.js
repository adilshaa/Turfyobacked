const jwt = require("jsonwebtoken")
const secretKey = "ResturantAdminkey";

const tokenVerify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) res.status(401).json("Invalid token");
      req.resadmin = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
};
module.exports = {
  tokenVerify,
};