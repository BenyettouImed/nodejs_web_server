const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500

app.get(/^\/(|index(.html)?)$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get(/\/new-page(.html)?/, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})
app.get(/\/old-page(.html)?/, (req, res) => {
    res.redirect(301, path.join(__dirname, 'views', 'new-page.html')) // 302 by default which means temporary redirect
    // 301 means permanent redirect
})

app.listen(PORT, () => console.log('Server running on port ' + PORT))