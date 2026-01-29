const path = require("path");

const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "username and password are required!" });
  }
  //check for duplicates
  const duplicates = await User.findOne({ username: user }).exec();
  if (duplicates) return res.sendStatus(409); // 409 means conflict
  try {
    const hashedPwd = await bcrypt.hash(pwd, 10); // 10 rounds of salting where each round is a random string of characters ensuring unique hash for each password
    //create and store user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });
    console.log(result);

    res.status(201).json({ Success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { handleNewUser };
