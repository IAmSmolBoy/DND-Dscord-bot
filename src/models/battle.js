const { Schema, model } = require("mongoose")

const battleSchema = new Schema({
    identifiers: {
        type: Object,
        required: true,
        unique: true
    },
    enemies: {
        type: Array,
        default: []
    }
})

const Battle = model("battles", battleSchema)
module.exports = Battle