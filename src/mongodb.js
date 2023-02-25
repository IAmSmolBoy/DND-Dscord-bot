function connect() {
    // Importing mongoose dependency
    const mongoose = require("mongoose")
    
// Creating connection to database
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log("MongoDB Connected"))
        .catch(err => console.log(err))
    
    // MongoDB listeners
    mongoose.connection.on("error", err => console.log(err))
    mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected"))
    
    // When process is ended, MongoDB connectionis closed
    process.on("SIGINT", async () => {
        await mongoose.connection.close()
        process.exit(0)
    })
}

function getSchema(tableName) {
    // Importing schemas
    const Char = require("./models/character")
    const Campaign = require("./models/campaign")
    const Battle = require("./models/battle")
    const Enemy = require("./models/enemy")

    // Get refeerenced table schema
    var Schema
    switch(tableName) {
        case "Char":
            Schema = Char
            break
        case "Campaign":
            Schema = Campaign
            break
        case "Enemy":
            Schema = Enemy
            break
        case "Battle":
            Schema = Battle
            break
    }
    return Schema
}

async function get(table, params) {
    const Schema = getSchema(table)

    // Find object with params provided
    return Schema.findOne(params)
}

async function save(table, params) {
    const Schema = getSchema(table)

    // Create new object with the schema and save it
    const object = Schema(params)
    await object.save()
    return object
}

async function edit(table, findParams, newObjectParams) {
    const Schema = getSchema(table)

    // Find document and update
    return await Schema.findOneAndUpdate(findParams, newObjectParams, { new: true })
}

async function del(table, params) {
    const Schema = getSchema(table)

    // Find document and update
    return await Schema.deleteOne(params)
}

function newObj(table, params) {
    const Schema = getSchema(table)

    // Create new object with the schema and return it
    const object = Schema(params)
    return object
}

module.exports = {
    connect,
    get,
    newObj,
    save,
    edit,
    del
}