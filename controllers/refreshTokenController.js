const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    // cookies?.jwt means if we have cookies then check for jwt
    return res.sendStatus(401); // unauthorized
  }

  const refreshToken = cookies.jwt;

  res.clearCookie("jwt", { httpOnly: true });

  const foundUser = await User.findOne({ refreshToken }).exec(); // we only put refreshToken because we have set resreshToken = cookies.jwt so we do not write refreshToken : refreshToken

  //detected refresh token reuse!
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); // forbidden
        console.log('attempted refresh token reuse!');
        const hackedUser = await User.findOne({
          username: decoded.username,
        }).exec(); // an old refresh token is getting reused!
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
        console.log(result);
      },
    );
    return res.sendStatus(403); // forbiden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken,
  );

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) { // refresh token expired, it is an old one
      console.log('expired refresh token')
      foundUser.refreshToken = [...newRefreshTokenArray];// creates copy of newRefreshTokenArray, do not point to the same memory location
      const result = await foundUser.save();
      console.log(result);
    }
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);

    // refresh token was still valid
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

    const newRefreshToken = jwt.sign(
      {"username": foundUser.username},
      process.env.REFRESH_TOKEN_SECRET,
      {expiresIn: '1d'}
    );
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();
    res.cookie('jwt', newRefreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})

    res.json({ accessToken });
  });
};
module.exports = { handleRefreshToken };
