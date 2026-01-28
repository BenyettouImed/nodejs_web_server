const path = require('path')
const usersDB = {
    users : require(path.join(__dirname, '..', 'model', 'users.json')),
    setUsers : function (data) {
        this.users = data
    }
}
const fsPromises = require('fs').promises;

const handleLogout = async (req  ,res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt){ // cookies?.jwt means if we have cookies then check for jwt
        return res.sendStatus(204); // no content to send back
    }
    const refreshToken = cookies.jwt;
    // is refresh token in db
    const foundUser = usersDB.users.find(usr => usr.refreshToken === refreshToken);
    if (!foundUser){
        res.clearCookie('jwt', {httpOnly: true,maxAge: 24 * 60 * 60 * 1000})
        return res.sendStatus(204)
    }
    // delete the refresh token in db
    const otherUsers = usersDB.users.filter(usr => usr.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''};
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users)
    )
    res.clearCookie('jwt', {httpOnly: true,maxAge: 24 * 60 * 60 * 1000})
    res.sendStatus(204);
}
module.exports = {handleLogout};
