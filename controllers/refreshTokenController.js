
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    // cookies?.jwt means if we have cookies then check for jwt
    return res.sendStatus(401);
  }
  
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({refreshToken}).exec();// we only put refreshToken because we have set resreshToken = cookies.jwt so we do not write refreshToken : refreshToken

  if (!foundUser) {
    return res.sendStatus(403); // forbiden
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      // as long as the refresh token is active it will keep generating a new access token
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3600s" },
    );
    res.json({ accessToken });
  });
};
module.exports = { handleRefreshToken };
