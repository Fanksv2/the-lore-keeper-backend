const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Access Denied" });
    }

    const secret = process.env.SECRET;
    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(400).json({ msg: "Invalid token" });
        }

        console.log(user);
        req.user = user;
        next();
    });
};

module.exports = validateToken;
