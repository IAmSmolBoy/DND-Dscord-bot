const { Schema, model } = require("mongoose")

const campaignSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
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

const Campaign = model("campaigns", campaignSchema)
module.exports = Campaign