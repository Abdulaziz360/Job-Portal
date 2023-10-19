const userModel = require('../Models/userModel');
const jwt = require('jsonwebtoken');

const fetchUserData = async (req, res, next) => {
  const jwt_token = req.cookies.myjwt;
  if (jwt_token) {
    try {
      const decoded = jwt.verify(jwt_token, 'mysecretkeyfortoken');
      req.decodedToken = decoded;
      const _id = req.decodedToken._id;
      const user = await userModel.findById({ _id: _id });
      res.locals.user = user; // Set user data in res.locals
      // console.log('user in middleware:',req.decodedToken)
    } catch (tokenError) {
      // Handle token error if needed
      console.log('Token error', tokenError);
    }
  } else {
    res.locals.user = null; // No token available
  }
  next();
};

module.exports = fetchUserData;
