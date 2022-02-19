const mongoose = require("mongoose")
const Schema = mongoose.Schema

const taskSchema = new Schema({
    dateTime: {
        type: Date,
        require: true
    },
    msgContent: {
        type: String,
        required: true
    }
})
const Task = mongoose.model("tasks", taskSchema)
module.exports = Task