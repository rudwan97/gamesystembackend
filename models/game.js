const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
    title: { type: String, unique: true, required: true},
    genre: { type: String, required: true},
    developer: {type: mongoose.Schema.Types.ObjectId, ref: "Developer", required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model("Game", gameSchema);
