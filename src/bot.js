require("./init_mongodb")
require("dotenv").config()

const { Client } = require("discord.js")
const client = new Client({intents: ["GUILDS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", 
"GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", 
"DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING", "GUILD_SCHEDULED_EVENTS"]})
const commands = require("./commands")
var prefix = "$"

client.on("ready", () => {
    console.log(`Who dares summon ${client.user.username}? Oh, its creater. Please don't kill me.`)
    var textChannels = client.channels.cache.filter(Channel => Channel.isText())
})

client.on("messageCreate", (msg) => {
    if (!msg.author.bot && msg.content.startsWith(prefix)) {
        const [cmd, ...args] = msg.content
            .substring(prefix.length)
            .split(/\s+/)
        const commandDict = {
            clear: {
                commandFunc: commands.clear, 
                description: "Deletes specified number of messages", 
                format: "$clear <number of messages to delete>"
            },
            addChar: {
                commandFunc: commands.addCharacter,
                description: "Adds a character with the specified max HP",
                format: "$addChar <username> <max HP>"
            },
            removeChar: {
                commandFunc: commands.removeCharacter,
                description: "Removes the specified character",
                format: "$removeChar <username>"
            },
            roll: {
                commandFunc: commands.diceRoll,
                description: "Rolls a dice and with the specified number of sides, number of die and the procifiency bonus",
                format: "$roll <no. of die>d<no. of sides> <optional: proficiency>"
            },
            dealDmg: {
                commandFunc: commands.dealDmgOrHeal,
                description: "deals dmg to the specified character or entity",
                format: "$dealDmg <username> <damage dealt>"
            },
            heal: {
                commandFunc: commands.dealDmgOrHeal,
                description: "heals the specified character or entity",
                format: "$heal <username> <hp healed>"
            },
            help: {
                description: "Helps you :)",
                format: "$help <page no.>"
            },
            longRest: {
                commandFunc: commands.longRest,
                description: "The party rests for a long time and regains all their HP",
                format: "$longRest"
            },
            shortRest: {
                commandFunc: commands.shortRest,
                description: "The party rests for a short time and regains some HP",
                format: "$shortRest <username> <hit dice>"
            }
        }
        if (cmd === "help") commands.helpMenu(msg, commandDict, args[0])
        else if (cmd in commandDict) commandDict[cmd].commandFunc(msg, args, commandDict[cmd]["format"])
    }
})

client.login(process.env.discordBotToken)
