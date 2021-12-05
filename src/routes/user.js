const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const validadeToken = require("./middleware/auth");
require("dotenv").config();

//Test: fanksv23
//id = 6186cb7bcd98d46841c2f548

router.get("/", validadeToken, async (req, res) => {
    const id = req.params.id;
    const { user } = req.user;
    return res.status(200).json(user);
});
module.exports = router;
