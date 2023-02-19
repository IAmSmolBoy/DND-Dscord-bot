/*                         Imports & Variable Assignments                         */
require("dotenv").config()
const { Client } = require("discord.js")
const {
    readTable,
    addToTable,
    editItem,
    deleteFromTable,
    getItemFromTable
} = require("./mongodb")

// Specifying required information
const intents = [ "GUILDS", "GUILD_MESSAGES" ]
const prefix = "$"

// Create the Client object which represents the bot
const client = new Client({ intents })





/*                         Bot Setup                         */
// Specifying listeners for the bot
client.on("ready", async () => {
    console.log(`Who dares summon ${client.user.username}? Oh, its creater. Please don't kill me.`)
    client.user.setActivity("$help for help")
})

client.on("messageCreate", msg => {
    if (msg.content[0] === prefix) {
        
    }
})

// Starts the bot
client.login(process.env.TESTING_TOKEN)