const path = require("path");

const usersDB = {
  users: require(path.join(__dirname, "..", "model", "users.json")),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "username and password are required!" });
  }
  //check for duplicates
  const duplicates = usersDB.users.find((person) => person.username === user);
  if (duplicates) return res.sendStatus(409); // 409 means conflict
  try {
    const hashedPwd = await bcrypt.hash(pwd, 10); // 10 rounds of salting where each round is a random string of characters ensuring unique hash for each password
    //store user
    const newUser = {
      "username": user,
      "roles": { "User": 2001 },
      "password": hashedPwd,
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users),
    );

    console.log(usersDB.users);

    res.status(201).json({ Success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { handleNewUser };
