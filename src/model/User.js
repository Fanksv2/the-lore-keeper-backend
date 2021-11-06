const mongoose = require("mongoose");

const User = mongoose.model("User", {
    name: {
        type: String,
        required: true,
    },
    login: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = User;
