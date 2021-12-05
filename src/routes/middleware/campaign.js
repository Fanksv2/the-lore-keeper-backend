const { Types } = require("mongoose");
const Campaign = require("../../model/Campaign");

const getCampaign = async (req, res, next) => {
    const { user } = req.user;
    const headerCampaign = req.headers["campaign"];

    if (!headerCampaign) {
        return res.status(400).json({ msg: "campaign não settada" });
    }

    try {
        const campaign = await Campaign.findOne({
            _userId: new Types.ObjectId(user._id),
            _id: new Types.ObjectId(headerCampaign),
        });

        if (!campaign) {
            return res.status(404).json({ msg: "not found" });
        }

        console.log("Campaign: \n", campaign, "\n");

        req.campaign = campaign;
        next();
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};

module.exports = getCampaign;
