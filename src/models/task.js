const mongoose = require("mongoose")
const Schema = mongoose.Schema
const reqStr = {
    type: String,
    required: true
}

const taskSchema = new Schema({
    dateTime: {
        type: Date,
        require: true
    },
    msgContent: reqStr,
    role: reqStr,
    deadline: {
        type: Date,
        require: true
    },
    channel: reqStr,
    guild: reqStr,
})
const Task = mongoose.model("tasks", taskSchema)
module.exports = Task