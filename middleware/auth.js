const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/user/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // { userId, email, username }
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    res.redirect('/user/login');
  }
};
