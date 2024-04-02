const { Schema, model } = require("mongoose")

const charSchema = new Schema({
    identifiers: { type: Object, required: true, unique: true  },
    // username: { type: String, required: true, unique: true },
    // guildID: { type: String, required: true, },
    DNDBeyondLink: { type: String },
    maxHP: { type: Number, required: true },
    currHP: { type: Number, required: true },
    tempHP: { type: Number, default: 0 },
    skillChecks: { type: Object }
})

const Character = model("characters", charSchema)
module.exports = Character