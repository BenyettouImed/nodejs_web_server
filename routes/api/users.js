const path = require("path");
const express = require("express");
const router = express.Router();
const usersController = require(
  path.join(__dirname, "..", "..", "controllers", "usersController"),
);
const ROLES_LIST = require(
  path.join(__dirname, "..", "..", "config", "roles_list"),
);
const verifyRoles = require(path.join(__dirname, "..", "..", "middleware", "verifyRoles"))

router
  .route("/")
  .get(usersController.getAllUsers)
  .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router.route("/:id").get(usersController.getUser);

module.exports = router;
