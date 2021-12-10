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
    const { cities } = req.campaign.content;
    return res.status(200).json({ cities });
});

router.post("/", validadeToken, getCampaign, async (req, res) => {
    const { user } = req.user;

    const { city } = req.body;
    city._id = new mongoose.Types.ObjectId();
    if (city.link) {
        city.link = new mongoose.Types.ObjectId();
    }

    const campaign = req.campaign;
    campaign.content.cities.push(city);

    console.log(campaign.content.cities);

    const updatedCampaign = await Campaign.findOneAndUpdate(
        { _id: req.campaign._id },
        campaign,
        { new: true }
    );

    return res.status(200).json({ city });
});

router.put("/", validadeToken, getCampaign, async (req, res) => {
    let { city } = req.body;
    city = {
        ...city,
        _id: new mongoose.Types.ObjectId(city._id),
        link: new mongoose.Types.ObjectId(city.link),
    };

    const { _id } = city;
    const { campaign } = req;

    const cityIndex = campaign.content.cities.findIndex((city) => {
        return city._id.equals(new mongoose.Types.ObjectId(_id));
    });

    //findIndex returns -1 when didnt find anything
    if (cityIndex < 0) {
        return res.status(400).json({ msg: "Não encontrado" });
    }

    campaign.content.cities[cityIndex] = city;

    await Campaign.findOneAndUpdate({ _id: campaign._id }, campaign, {
        new: true,
    });

    return res.status(200).json({ city });
});

router.delete("/", validadeToken, getCampaign, async (req, res) => {
    console.log("Requisicao: " + req);
    let { city } = req.body;
    city = {
        ...city,
        _id: new mongoose.Types.ObjectId(city._id),
    };

    const { _id } = city;
    const { campaign } = req;

    const cityIndex = campaign.content.cities.findIndex((city) => {
        return city._id.equals(new mongoose.Types.ObjectId(_id));
    });

    //findIndex returns -1 when didnt find anything
    if (cityIndex < 0) {
        return res.status(400).json({ msg: "Não encontrado" });
    }

    campaign.content.cities.pull(city);

    await Campaign.findOneAndUpdate({ _id: campaign._id }, campaign, {
        new: true,
    });

    return res.status(200).json({ city });
});

module.exports = router;
