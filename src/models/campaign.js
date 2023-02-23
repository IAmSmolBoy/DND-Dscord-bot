const { Schema, model } = require("mongoose")

const charSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    characters: {
        type: Array,
        required: true,
    },
    battles: {
        type: Array,
        required: true,
    },

})

const Character = model("characters", charSchema)
module.exports = Character