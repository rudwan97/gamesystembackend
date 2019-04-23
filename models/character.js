const mongoose = require("mongoose");

const characterSchema = mongoose.Schema({
    name: {type: String, unique: false, required: true},
    game: {type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model("Character", characterSchema);
