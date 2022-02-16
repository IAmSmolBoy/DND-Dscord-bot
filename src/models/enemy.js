const mongoose = require("mongoose")
const Schema = mongoose.Schema

const enemySchema = new Schema({
    monsterId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    type: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    initMod: {
        type: Number,
        required: true
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

const enemy = mongoose.model("monster", enemySchema)
module.exports = enemy