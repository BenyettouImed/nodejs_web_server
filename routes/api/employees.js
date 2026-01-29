const express = require("express");
const router = express.Router();
const path = require("path");
const employeesController = require(
  path.join(__dirname, "..", "..", "controllers", "employeesController"),
);
const ROLES_LIST = require(
  path.join(__dirname, "..", "..", "config", "roles_list"),
);
const verifyRoles = require(
  path.join(__dirname, "..", "..", "middleware", "verifyRoles"),
);

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.creatNewEmployee,
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.updateEmployee,
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
