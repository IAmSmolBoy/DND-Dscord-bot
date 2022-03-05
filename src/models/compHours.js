const mongoose = require("mongoose")
const Schema = mongoose.Schema
const reqStr = {
    type: String,
    required: true
}

const hoursSchema = new Schema({
    user: reqStr,
    hours: reqStr,
    last: [{
        type: String,
        required: true
    }],
    latestDate: {
        type: Date,
        required: true
    }
})

const Hours = mongoose.model("hours", hoursSchema)
module.exports = Hours