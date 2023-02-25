const { Schema, model } = require("mongoose")

const battleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    enemies: {
        type: Array,
        required: true
    }
})

const Battle = model("battles", battleSchema)
module.exports = Battle