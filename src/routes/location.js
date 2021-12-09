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
    const { locations } = req.campaign.content;
    return res.status(200).json({ locations });
});

router.post("/", validadeToken, getCampaign, async (req, res) => {
    const { user } = req.user;

    const { location } = req.body;
    location._id = new mongoose.Types.ObjectId();
    if (location.link) {
        location.link = new mongoose.Types.ObjectId();
    }

    const campaign = req.campaign;
    campaign.content.locations.push(location);

    console.log(campaign.content.locations);

    const updatedCampaign = await Campaign.findOneAndUpdate(
        { _id: req.campaign._id },
        campaign,
        { new: true }
    );

    return res.status(200).json({ location });
});

router.put("/", validadeToken, getCampaign, async (req, res) => {
    let { location } = req.body;
    location = {
        ...location,
        _id: new mongoose.Types.ObjectId(location._id),
        link: new mongoose.Types.ObjectId(location.link),
    };

    const { _id } = location;
    const { campaign } = req;

    const locationIndex = campaign.content.locations.findIndex((location) => {
        return location._id.equals(new mongoose.Types.ObjectId(_id));
    });

    //findIndex returns -1 when didnt find anything
    if (locationIndex < 0) {
        return res.status(400).json({ msg: "Não encontrado" });
    }

    campaign.content.locations[locationIndex] = location;

    await Campaign.findOneAndUpdate({ _id: campaign._id }, campaign, {
        new: true,
    });

    return res.status(200).json({ location });
});

module.exports = router;
