const express = require('express')
const app = express()
const path = require('path')
const {logger} = require('./middleware/logEvents')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandling')
const verifyJWT = require(path.join(__dirname,'middleware', 'verifyJWT'))
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 3500
const corsOptions = require('./config/corsOptions')

//custom middleware logger
app.use(logger)

app.use(credentials);

app.use(cors(corsOptions))

// built in middleware for regetring form data
app.use(express.urlencoded({ extended: false }))

// built in middleware for json data
app.use(express.json())

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.join(__dirname, '/public')))
/* app.use('/subdir', express.static(path.join(__dirname, '/public'))) */

//routes
app.use('/', require('./routes/root'))
/* app.use('/subdir', require('./routes/subdir')) */
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

//Route handlers
/* app.get(/\/hello(.html)?/, (req, res, next) => {
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

app.get('/handler', [one, two, three]) */

app.all(/\/*/, (req, res) => { // all types of requests (GET, POST, PUT, DELETE, etc.)
    res.status(404)
    if (req.accepts('html')){ //when browser requests HTML
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if (req.accepts('json')){ //when API client requests JSON
        res.json({error: '404 Not Found'})
    }
    else{
        res.type('txt').send('404 Not Found')
    }
    
})

app.use(errorHandler)

app.listen(PORT, () => console.log('Server running on port ' + PORT))