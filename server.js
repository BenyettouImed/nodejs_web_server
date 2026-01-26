const express = require('express')
const app = express()
const path = require('path')
const {logger} = require('./middleware/logEvents')
const cors = require('cors')
const PORT = process.env.PORT || 3500

//custom middleware logger
app.use(logger)

// Cross Origin Resource Sharing
const whitelist = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:3500']// the sites that will pass the cors and that access our backend, the sencond one can represent our frontend
const corsOptions = {
    origin : (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionssSuccessStatus : 200
}
app.use(cors(corsOptions))

// built in middleware for regetring form data
app.use(express.urlencoded({ extended: false }))

// built in middleware for json data
app.use(express.json())

//serve static files
app.use(express.static(path.join(__dirname, '/public')))

app.get(/^\/(|index(.html)?)$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get(/\/new-page(.html)?/, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})
app.get(/\/old-page(.html)?/, (req, res) => {
    res.redirect(301, '/new-page.html') // 302 by default which means temporary redirect
    // 301 means permanent redirect
})

//Route handlers
app.get(/\/hello(.html)?/, (req, res, next) => {
    console.log('attempted to load hello.html')
    next()
}, (req, res) => {
    res.send('Hello World!')
})

const one = (req, res, next) => {
    console.log('one')
    next()
}
const two = (req, res, next) => {
    console.log('two')
    next()
}
const three = (req, res) => {
    console.log('three')
    res.send('Finished!')
}

app.get('/handler', [one, two, three])

app.get(/\/*/, (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})



app.listen(PORT, () => console.log('Server running on port ' + PORT))