const path = require("path");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  const foundUser = await User.findOne({username: user}).exec();
  if (!foundUser) {
    return res.sendStatus(401); // 401 means unauthorized
  }
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    //create JWT
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      }, // payload
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3600s" }, // in production 5 to 15 minutes
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );
    //Saving refresh token with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);


    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); // maxAge = 1 day, we can add secure: true for https, it is required for chrome but will not work with thunderclient

    // an xss attack is when an attacker executes his js code in your application, httpOnly prevents that

    // a csrf attack is when an attacker tricks a user into performing an action they didn't intend to (like changing their password) so your app sends a request to a malicious site containing your cookie, (sameSite: "strict" or "lax") prevents cross site requests, it is required to add sameSite when integrating the frontend, try sameSite:'None' if there is a cors problem
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};
module.exports = { handleLogin };
