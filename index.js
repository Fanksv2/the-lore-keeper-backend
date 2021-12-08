require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./src/routes/auth");
const user = require("./src/routes/user");
const campaign = require("./src/routes/campaign");
const world = require("./src/routes/world");
const location = require("./src/routes/location");
const npc = require("./src/routes/npc");
const city = require("./src/routes/city");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).json({ msg: "OPA" });
});

app.use("/auth", auth);
app.use("/user", user);
app.use("/campaign", campaign);
app.use("/world", world);
app.use("/location", location);
app.use("/npc", npc);
app.use("/city", city);

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
    .connect(process.env.DB_IP, {
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
