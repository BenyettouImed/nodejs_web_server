const express = require('express')
const router = express.Router()
const path = require('path')
const refreshTokenController = require(path.join(__dirname, '..', 'controllers', 'refreshTokenController.js'))

router.get('/', refreshTokenController.handleRefreshToken)

module.exports = router;