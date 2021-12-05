const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Campaign = require("../model/Campaign");
const jwt = require("jsonwebtoken");
const validadeToken = require("./middleware/auth");
const getCampaign = require("./middleware/campaign");
const mongoose = require("mongoose");
require("dotenv").config();

//Test: fanksv23
//id = 6186cb7bcd98d46841c2f548

router.get("/", validadeToken, getCampaign, async (req, res) => {
    const { user } = req.user;
    const { npcs } = req.campaign.content;
    return res.status(200).json({ npcs });
});

router.post("/", validadeToken, getCampaign, async (req, res) => {
    const { user } = req.user;

    const { npc } = req.body;
    npc._id = new mongoose.Types.ObjectId();

    const { campaign } = req;
    campaign.content.npcs.push(npc);

    const updatedCampaign = await Campaign.findOneAndUpdate(
        { _id: campaign._id },
        campaign,
        { new: true }
    );

    return res.status(200).json({ npc });
});

module.exports = router;
