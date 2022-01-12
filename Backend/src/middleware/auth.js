const jwt = require("jsonwebtoken");
const { SO_SECRET_KEY } = require("../lib/config");

const Auth = (request) => {
  const header = request.headers.authorization;
  if (!header) {
    return {
      isAuth: false,
    };
  }
  const token = header.split(" ")[1];
  if (!token) {
    return {
      isAuth: false,
    };
  }

  try {
    const user = jwt.verify(token, SO_SECRET_KEY);
    return {
      user,
      isAuth: true,
    };
  } catch (error) {
    return {
      isAuth: false,
    };
  }
};

module.exports = Auth;
