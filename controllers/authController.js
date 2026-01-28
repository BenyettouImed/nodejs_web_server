const path = require('path')
const usersDB = {
    users : require(path.join(__dirname, '..', 'model', 'users.json')),
    setUsers : function (data) {
        this.users = data
    }
}
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const fsPromises = require('fs').promises

const handleLogin = async (req  ,res) => {
    const {user,pwd} = req.body;
    if (!user || !pwd){
        return res.status(400).json({'message' : 'Username and password are required'})
    }
    const foundUser = usersDB.users.find(usr => usr.username === user);
    if (!foundUser){
        return res.sendStatus(401) // 401 means unauthorized
    }
    const match = await bcrypt.compare(pwd, foundUser.password)
    if (match) {
        //create JWT
        const accessToken = jwt.sign(
            {"username" : foundUser.username},// payload
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30s'} // in production 5 to 15 minutes
        )
        const refreshToken = jwt.sign(
            {"username" : foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        )
        //Saving refresh token with current user
        const otherUsers = usersDB.users.filter(usr => usr.username !== foundUser.username);
        const currentUser = {...foundUser, refreshToken}
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users))
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})// maxAge = 1 day, we can add secure: true for https

        // an xss attack is when an attacker executes his js code in your application, httpOnly prevents that

        // a csrf attack is when an attacker tricks a user into performing an action they didn't intend to (like changing their password) so your app sends a request to a malicious site containing your cookie, (sameSite: "strict" or "lax") prevents cross site requests
        res.json({accessToken})
    }
    else{
        res.sendStatus(401)
    }

}
module.exports = {handleLogin};
