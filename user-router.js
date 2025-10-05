const express = require("express");
const userRouter = express.Router();

// register route
userRouter.get("/register", async (req, res) => {
    res.send({ message: "Register endpoint" });
});

// login route
userRouter.get("/login", async (req, res) => {
    res.send({ message: "Login endpoint" });
});

// profile route
userRouter.get("/profile", async (req, res) => {
    res.send({ message: "Private profile endpoint" });
});

// admin route
userRouter.get("/admin", async (req, res) => {
    res.send({ message: "Private admin only endpoint" });
});

module.exports = userRouter;
