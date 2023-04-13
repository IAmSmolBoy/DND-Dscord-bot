const { Schema, model } = require("mongoose")

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
    },
    skillChecks: {
        type: Object
    },
    spellSlots: {
        type: Array
    }
})

const Character = model("characters", charSchema)
module.exports = Character