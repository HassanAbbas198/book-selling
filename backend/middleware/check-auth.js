const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //by convention the headers have : "Bearer kjasjkdadasjdakddlkqiw(token)" thats why we used[1]"
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer");

    //adding this object to the request
    req.userData = {
      name: decodedToken.name,
      email: decodedToken.email,
      userId: decodedToken.userId
    };
    next();
  } catch (error) {
    res.status(401).json({
      message: "Auth faied!"
    });
  }
};
