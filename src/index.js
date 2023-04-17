/*                         Imports & Variable Assignments                         */
require("dotenv").config()
const { connect } = require("./mongodb")
const { Client } = require("discord.js")
const commandList = require("./commandList")

// Specifying required information
const intents = [ "GUILDS", "GUILD_MESSAGES" ]
const prefix = "$"

// Create the Client object which represents the bot
const client = new Client({ intents })

//Create MongoDB connection
connect()





/*                         Bot Setup                         */
// Specifying listeners for the bot
client.on("ready", async () => {
    console.log(`Who dares summon ${client.user.username}? Oh, its creater. Please don't kill me.`)
    client.user.setActivity(prefix + "help for help")
})

client.on("messageCreate", async msg => {
    // Split the message into command and arguments
    const msgStr = msg.content
    const [ command, ...args ] = msgStr.slice(1).split(/\s+/)

    if (msgStr[0] === prefix  && !msg.author.bot) {
        if (Object.keys(commandList).includes(command.toLowerCase())) {
            // Check if user has permissions to run the command
            const admin = msg.member.permissions.has('ADMINISTRATOR')
            if (commandList[command.toLowerCase()].admin && !admin) return msg.channel.send("You are not allowed to run this command. Ask ur DM to do it")

            // Run the command
            commandList[command.toLowerCase()].run({
                command: command.toLowerCase(),
                commandList,
                guild: msg.guild,
                args,
                channel: msg.channel,
                admin,
                format: commandList[command.toLowerCase()].format
            })
        }
        else {
            return msg.channel.send("Command not recognised")
        }
    }
})

// Starts the bot
client.login(process.env.DND_BOT_TOKEN)