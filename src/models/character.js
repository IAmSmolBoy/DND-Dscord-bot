const mongoose = require("mongoose")
const Schema = mongoose.Schema

const charSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    maxHP: {
        type: Number,
        required: true
    },
    currHP: {
        type: Number,
        required: true
    }
})

const Character = mongoose.model("characters", charSchema)
module.exports = Character