const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const userRouter = require("./user-router");

const app = express();

dotenv.config({ path: path.join(__dirname, "./.env") });

// parse json request body
app.use(express.json());

const port = 3000;
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Connected to MongoDB");
});

app.get("/", (req, res) => {
    res.send(
        "Hello Students! We are learning Autnetication and Authorization today."
    );
});

// routes
app.use("/users", userRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
