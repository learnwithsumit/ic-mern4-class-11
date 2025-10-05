const express = require("express");
const moment = require("moment");
const userRouter = express.Router();
const User = require("./models/user.model");
const { generateToken } = require("./services/token.service");
const {
    checkAuthentication,
    checkAuthorization,
} = require("./middlewares/check-auth");

// register route
userRouter.post("/register", async (req, res) => {
    const userBody = req.body;

    try {
        // check if email is taken
        if (await User.isEmailTaken(userBody.email)) {
            return res.status(400).send({
                message: "Email already taken!",
            });
        }

        // create user
        const user = await User.create({
            name: userBody.name,
            email: userBody.email,
            password: userBody.password,
        });

        // send response
        res.status(200).send({
            message: "User registered successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({
            message: err?.message,
        });
    }
});

// login route
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // check credentials
        if (!user || !(await user.isPasswordMatch(password))) {
            return res
                .status(401)
                .send({ message: "Incorrect email or password!" });
        }

        // JWT token/concert ticket generate
        const accessTokenExpires = moment().add(
            process.env.JWT_ACCESS_EXPIRATION_MINUTES,
            "minute"
        );
        const accessToken = await generateToken(
            user._id,
            user.role,
            accessTokenExpires,
            "access"
        );

        // 1) refresh Token generate 2) save in DB

        res.send({
            message: "Login successful!",
            data: {
                id: user._id,
                name: user.name,
                email: user.emil,
                role: user.role,
                access: {
                    token: accessToken,
                    expires: accessTokenExpires.toDate(),
                    expiresIn: process.env.JWT_ACCESS_EXPIRATION_MINUTES * 60,
                },
            },
        });
    } catch (err) {
        res.status(401).send({ message: err.message });
    }
});

// profile route
userRouter.get("/profile", checkAuthentication, async (req, res) => {
    res.send({ message: "Private profile endpoint" });
});

// admin route
userRouter.get(
    "/admin",
    checkAuthentication,
    checkAuthorization,
    async (req, res) => {
        res.send({ message: "Private admin only endpoint" });
    }
);

module.exports = userRouter;
