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

    if (npc.link) {
        npc.link = new mongoose.Types.ObjectId();
    }

    const { campaign } = req;
    campaign.content.npcs.push(npc);

    const updatedCampaign = await Campaign.findOneAndUpdate(
        { _id: campaign._id },
        campaign,
        { new: true }
    );

    return res.status(200).json({ npc });
});

router.put("/", validadeToken, getCampaign, async (req, res) => {
    let { npc } = req.body;
    npc = {
        ...npc,
        _id: new mongoose.Types.ObjectId(npc._id),
        link: new mongoose.Types.ObjectId(npc.link),
    };

    const { _id } = npc;
    const { campaign } = req;

    const npcIndex = campaign.content.npcs.findIndex((npc) => {
        return npc._id.equals(new mongoose.Types.ObjectId(_id));
    });

    //findIndex returns -1 when didnt find anything
    if (npcIndex < 0) {
        return res.status(400).json({ msg: "Não encontrado" });
    }

    campaign.content.npcs[npcIndex] = npc;

    await Campaign.findOneAndUpdate({ _id: campaign._id }, campaign, {
        new: true,
    });

    return res.status(200).json({ npc });
});

router.delete("/", validadeToken, getCampaign, async (req, res) => {
    console.log("Requisicao: " + req);
    let { npc } = req.body;
    npc = {
        ...npc,
        _id: new mongoose.Types.ObjectId(npc._id),
    };

    const { _id } = npc;
    const { campaign } = req;

    const npcIndex = campaign.content.npcs.findIndex((npc) => {
        return npc._id.equals(new mongoose.Types.ObjectId(_id));
    });

    //findIndex returns -1 when didnt find anything
    if (npcIndex < 0) {
        return res.status(400).json({ msg: "Não encontrado" });
    }

    campaign.content.npcs.pull(npc);

    await Campaign.findOneAndUpdate({ _id: campaign._id }, campaign, {
        new: true,
    });

    return res.status(200).json({ npc });
});

module.exports = router;