const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
        ref: "user",
        unique: true,
    },
    token: {type:String, require: true },
    createdAt: {type: Date, default: Date.now(), expires: 3600}
})

module.exports = mongoose.model("Token", TokenSchema);