const express = require('express')
const router  = express.Router()
const path = require('path')
const employeesController = require(path.join(__dirname,'..', '..', 'controllers', 'employeesController'))

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.creatNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee)

router.route('/:id')
      .get(employeesController.getEmployee)

module.exports = router