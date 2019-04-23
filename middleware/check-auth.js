const jwt = require("jsonwebtoken");
const JWT_KEY = "secret_this_should_be_longer";

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    const decodedToken = jwt.verify(token, JWT_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
