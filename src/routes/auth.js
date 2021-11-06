const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/register", async (req, res) => {
    const { name, login, password, confirmPassword } = req.body;
    const isValidRegister = await validateRegister({
        name,
        login,
        password,
        confirmPassword,
    });

    if (!isValidRegister) {
        return res
            .status(400)
            .json({ msg: "Some parameter is missing or wrong" });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = User({
        name,
        login,
        password: passwordHash,
    });

    try {
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        console.log(err);
        res.status(500).json(newUser);
    }
});

router.post("/login", async (req, res) => {
    const { login, password } = req.body;
    const user = await validateLogin({ login, password });

    if (!user) {
        return res
            .status(400)
            .json({ msg: "Some parameter is missing or user not founds" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
        return res.status(401).json({ msg: "Invalid credentials" });
    }

    const secret = process.env.SECRET;

    //The user will be used for the token, so it cant have the password
    let userToToken = { ...user }._doc;
    delete userToToken.password;
    delete userToToken.login;
    console.log(userToToken);
    const token = await jwt.sign({ user: userToToken }, secret);

    return res.status(200).json({ msg: "Sucess", token });
});

async function validateLogin({ login, password }) {
    if (!login) {
        return false;
    }

    if (!password) {
        return false;
    }

    const user = await User.findOne({ login: login });
    if (!user) {
        return false;
    }

    return user;
}

async function validateRegister({ name, login, password, confirmPassword }) {
    if (!name) {
        return false;
    }

    if (!login) {
        return false;
    }

    if (!password) {
        return false;
    } else if (password !== confirmPassword) {
        return false;
    }

    const userExists = await User.findOne({ login: login });
    if (userExists) {
        return false;
    }

    return true;
}

module.exports = router;
