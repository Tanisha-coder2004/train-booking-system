const express = require("express");
const router = express.Router();

const container = require("../../container");
const { userService } = container();

const UserController = require("./user.controller");
const authMiddleware = require("../../shared/middlewares/auth.middleware");

const controller = new UserController(userService);

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", authMiddleware, controller.me);

module.exports = router;