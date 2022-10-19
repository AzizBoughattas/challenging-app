const jwt = require("jsonwebtoken");


module.exports = function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.isAdmin===false) return res.status(400).send("Invalid Token");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
}
