const mongoose = require("mongoose")
const Schema = mongoose.Schema
const reqNum = {
    type: Number,
    required: true
}

const hoursSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    hours: reqNum,
    last: [ reqNum ],
})

const Hours = mongoose.model("hours", hoursSchema)
module.exports = Hours