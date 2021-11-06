require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./src/routes/auth");
const user = require("./src/routes/user");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ msg: "OPA" });
});

app.use("/auth", auth);
app.use("/user", user);

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
    .connect(`mongodb://192.168.0.120/thelorekeeper`, {
        useNewUrlParser: true,
        user: dbUser,
        pass: dbPassword,
    })
    .then(() => {
        app.listen(process.env.PORT);
        console.log("SERVER IS UP");
    })
    .catch((err) => {
        console.log("SERVER IS DOWN\n", err);
        console.log(err);
    });
