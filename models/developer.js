const mongoose = require("mongoose");

const developerSchema = mongoose.Schema({
    name: {type: String, unique: true, required: true},
    description: {type: String, required: true},
    city: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model("Developer", developerSchema);
