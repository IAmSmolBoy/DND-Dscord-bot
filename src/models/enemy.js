const { Schema, model } = require("mongoose")

const enemySchema = new Schema({
    monster: {
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
    }
})

const enemy = model("monster", enemySchema)
module.exports = enemy