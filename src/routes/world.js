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
    const { worlds } = req.campaign.content;
    return res.status(200).json({ worlds });
});

router.post("/", validadeToken, getCampaign, async (req, res) => {
    const { user } = req.user;
    console.log(req.body);
    const { world } = req.body;
    world._id = new mongoose.Types.ObjectId();

    const { campaign } = req;
    campaign.content.worlds.push(world);

    const updatedCampaign = await Campaign.findOneAndUpdate(
        { _id: campaign._id },
        campaign,
        { new: true }
    );

    return res.status(200).json({ world });
});

router.put("/", validadeToken, getCampaign, async (req, res) => {
    let { world } = req.body;
    world = {
        ...world,
        _id: new mongoose.Types.ObjectId(world._id),
    };

    const { _id } = world;
    const { campaign } = req;

    const worldIndex = campaign.content.worlds.findIndex((world) => {
        return world._id.equals(new mongoose.Types.ObjectId(_id));
    });

    //findIndex returns -1 when didnt find anything
    if (worldIndex < 0) {
        return res.status(400).json({ msg: "Não encontrado" });
    }

    campaign.content.worlds[worldIndex] = world;

    await Campaign.findOneAndUpdate({ _id: campaign._id }, campaign, {
        new: true,
    });

    return res.status(200).json({ world });
});

module.exports = router;
