const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Campaign = require("../model/Campaign");
const jwt = require("jsonwebtoken");
const validadeToken = require("./middleware/auth");
const mongoose = require("mongoose");
require("dotenv").config();

//Test: fanksv23
//id = 6186cb7bcd98d46841c2f548

router.get("/", validadeToken, async (req, res) => {
    const { user } = req.user;

    try {
        const campaigns = await Campaign.find({
            _userId: new mongoose.Types.ObjectId(String(user._id)),
        });

        return res.status(200).json({ campaigns });
    } catch (err) {
        return res.status(500);
    }
});

router.post("/", validadeToken, async (req, res) => {
    const { user } = req.user;
    const { name } = req.body;

    if (!validateCampaign({ name })) {
        return res.status(400).json({ msg: "Inválido" });
    }

    const newCampaign = Campaign({
        name,
        _userId: user._id,
    });

    try {
        await newCampaign.save();
        return res.status(201).json({ campaign:newCampaign });
    } catch (err) {
        return res.status(500);
    }
});

async function validateCampaign({ name }) {
    if (!name) {
        return false;
    }

    return true;
}
module.exports = router;
