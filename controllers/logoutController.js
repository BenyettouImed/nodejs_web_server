
const User = require("../model/User");

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    // cookies?.jwt means if we have cookies then check for jwt
    return res.sendStatus(204); // no content to send back
  }
  const refreshToken = cookies.jwt;
  // is refresh token in db
  const foundUser = await User.findOne({refreshToken}).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.sendStatus(204);
  }
  // delete the refresh token in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);


  res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  res.sendStatus(204);
};
module.exports = { handleLogout };
