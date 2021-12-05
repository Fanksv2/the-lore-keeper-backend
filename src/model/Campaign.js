const mongoose = require("mongoose");

const Campaign = mongoose.model("Campaign", {
    name: {
        type: String,
        required: true,
    },
    _userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    content: {
        worlds: [
            {
                _id: mongoose.Schema.ObjectId,
                name: String,
                lore: String,
                religionsAndCulture: String,
                government: String,
                geography: String,
            },
        ],
        locations: [
            {
                _id: mongoose.Schema.ObjectId,
                name: String,
                surroundingArea: String,
                description: String,
            },
        ],
        npcs: [
            {
                _id: mongoose.Schema.ObjectId,
                name: String,
                exterior: String,
                interior: String,
            },
        ],
    },
});

module.exports = Campaign;
