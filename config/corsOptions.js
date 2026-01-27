// Cross Origin Resource Sharing
const whitelist = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:3500']// the sites that will pass the cors and that access our backend, the sencond one can represent our frontend
const corsOptions = {
    origin : (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) { // | !origin is for undefined origins (for development)
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionssSuccessStatus : 200
}

module.exports  = corsOptions