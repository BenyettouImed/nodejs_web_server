const path = require('path')
const usersDB = {
    users : require(path.join(__dirname, '..', 'model', 'users.json')),
    setUsers : function (data) {
        this.users = data
    }
}
const bcrypt = require('bcrypt')
const handleLogin = async (req  ,res) => {
    const {user,pwd} = req.body;
    if (!user || !pwd){
        return res.status(400).json({'message' : 'Username and password are required'})
    }
    const foundUser = usersDB.users.find(usr => usr.username === user);
    if (!foundUser){
        return res.status(401).json({"message" : `User ${user} not found`}) // 401 means unauthorized
    }
    const match = await bcrypt.compare(pwd, foundUser.password)
    if (match) {
        res.json({"message" : `User ${user} logged in`})
    }
    else{
        res.sendStatus(401)
    }

}
module.exports = {handleLogin};
