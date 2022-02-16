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
        const [cmd, ...args] = msg.content.toLowerCase()
            .substring(prefix.length)
            .split(/\s+/)
        const commandDict = {
            clear: {
                commandFunc: commands.clear, 
                description: "Deletes specified number of messages", 
                format: "$clear <number of messages to delete>"
            },
            addchar: {
                commandFunc: commands.addCharacter,
                description: "Adds a character with the specified max HP",
                format: "$addchar <username> <max HP> <initative modifier>"
            },
            removechar: {
                commandFunc: commands.removeCharacter,
                description: "Removes the specified character",
                format: "$removechar <username>"
            },
            roll: {
                commandFunc: commands.diceRoll,
                description: "Rolls a dice and with the specified number of sides, number of die and the procifiency bonus",
                format: "$roll <no. of die>d<no. of sides> <optional: proficiency>"
            },
            dealdmg: {
                commandFunc: commands.dealDmgOrHeal,
                description: "deals dmg to the specified character or entity",
                format: "$dealdmg <username> <damage dealt>"
            },
            heal: {
                commandFunc: commands.dealDmgOrHeal,
                description: "heals the specified character or entity",
                format: "$heal <username> <hp healed>"
            },
            help: {
                description: "Helps you :)",
                format: "$help <page no. or command>"
            },
            longrest: {
                commandFunc: commands.longRest,
                description: "The party rests for a long time and regains all their HP",
                format: "$longrest"
            },
            shortrest: {
                commandFunc: commands.shortRest,
                description: "The party rests for a short time and regains some HP",
                format: "$shortrest <username> <hit dice>"
            },
            battlemode: {
                commandFunc: commands.battleMode,
                description: "Get ready, its time to play",
                format: "$battlemode <username> <intiative>"
            }
        }
        const enemyCommands = {
            addenemy: {
                commandFunc: commands.addEnemy,
                description: "adds specified number of enemies with specified health",
                format: "$addenemy <enemy type> <max HP> <initiative modifier> <no. of enemies>"
            },
            battle: {
                commandFunc: commands.battle,
                description: "Enters battle mode for enemies",
                format: "$battle"
            },
            battleover: {
                commandFunc: commands.reset,
                description: "Resets the battlefield and deletes all monsters",
                format: "$battleOver"
            }

        }
        if (cmd === "help") {
            // if (args.length === 0) {
            //     commands.helpMenu(msg, commandDict)
            // }
            // else {
            //     if (args[0].toLowerCase() === "dm"){
            //         if(msg.member.permissions.has('ADMINISTRATOR')) commands.helpEnemies(msg, enemyCommands, args[1])
            //         else return msg.channel.send("This is meant for the dm")
            //     }
            //     else commands.helpMenu(msg, commandDict, args[0])
            // }
            switch (args.length) {
                case 0:
                    commands.helpMenu(msg, commandDict)
                    break;
                case 1:
                    if (args[0].toLowerCase() === "dm") {
                        if(msg.member.permissions.has('ADMINISTRATOR')) commands.helpEnemies(msg, enemyCommands)
                        else return msg.channel.send("This is meant for the dm")
                    }
                    else commands.helpMenu(msg, commandDict, args[0])
                    break;
                case 2:
                    if (args[0].toLowerCase() === "dm") {
                        if(msg.member.permissions.has('ADMINISTRATOR')) commands.helpEnemies(msg, enemyCommands, args[1])
                        else return msg.channel.send("This is meant for the dm")
                    }
                    else return msg.channel.send("Invalid arguments. Format: " + commandDict.help.format)
                    break;
                default:
                    return msg.channel.send("Invalid arguments. Format: " + commandDict.help.format)
            }
        }
        else if (cmd in commandDict) commandDict[cmd].commandFunc(msg, args, commandDict[cmd]["format"])
        else if (cmd in enemyCommands) enemyCommands[cmd].commandFunc(msg, args, enemyCommands[cmd]["format"])
    }
})

client.login(process.env.discordBotToken)
