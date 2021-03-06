require("./init_mongodb")
require("dotenv").config()

const { Client } = require("discord.js"), Task = require("./models/task"), rr = require("./models/rr")
const client = new Client({ intents: [ "GUILDS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", 
"GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", 
"DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING", "GUILD_SCHEDULED_EVENTS" ], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
const commands = require("./commands")
const { addTemp } = require("./commands/addTemp")
const { removeInit } = require("./commands/removeInit")
var prefix = "$"
const commandDict = {
    clear: {
        commandFunc: commands.clear, 
        description: "Deletes specified number of messages", 
        format: "$clear <number of messages to delete>"
    },
    add: {
        commandFunc: commands.addCharacter,
        description: "Adds a character with the specified max HP",
        format: "$add <username> <max HP>"
    },
    remove: {
        commandFunc: commands.removeCharacter,
        description: "Removes the specified character",
        format: "$remove <username>"
    },
    r: {
        commandFunc: commands.diceRoll,
        description: "Rolls a dice and with the specified number of sides, number of die and the procifiency bonus",
        format: "$r <optional: no. of die>d<no. of sides> <optional: proficiency>"
    },
    dmg: {
        commandFunc: commands.dealDmgOrHeal,
        description: "deals dmg to the specified character or entity",
        format: "$dmg <username> <damage dealt>"
    },
    heal: {
        commandFunc: commands.dealDmgOrHeal,
        description: "heals the specified character or entity",
        format: "$heal <username> <hp healed>"
    },
    help: {
        description: "Helps you :)",
        format: "$help <optional: command name or page no.>"
    },
    lr: {
        commandFunc: commands.longRest,
        description: "The party rests for a long time and regains all their HP",
        format: "$lr"
    },
    sr: {
        commandFunc: commands.shortRest,
        description: "The party rests for a short time and regains some HP",
        format: "$sr <username> <hit dice> <optional: constitution modifier>"
    },
    bm: {
        commandFunc: commands.battleMode,
        description: "Get ready, its time to play",
        format: "$bm <username> <intiative>"
    },
    lvlup: {
        commandFunc: commands.levelUp,
        description: "Updates your max hp after you level up",
        format: "$lvlup <username> <hp increase>"
    },
    view: {
        commandFunc: commands.view,
        description: "Views profile",
        format: "$view <optional: username>"
    },
    summon: {
        commandFunc: addTemp,
        description: "Sunmmons a creature in the middle of battle",
        format: "$summon <name> <hp> <initiative> <quantity> <optional: owner>"
    },
    removeinit: {
        commandFunc: removeInit,
        description: "removes a creature from the initative list by index",
        format: "$removeinit <index>"
    },
}
const enemyCommands = {
    addenemy: {
        commandFunc: commands.addEnemy,
        description: "adds specified number of enemies with specified health",
        format: "$addenemy <enemy type> <max HP> <initiative modifier> <optional: no. of enemies>"
    },
    battle: {
        commandFunc: commands.battle,
        description: "Enters battle mode for enemies",
        format: "$battle"
    },
    reset: {
        commandFunc: commands.reset,
        description: "Resets the battlefield and deletes all monsters",
        format: "$reset"
    },
    helpDM: {
        description: "Helps the dm with enemy commands",
        format: "$help dm <optional: command name or page no.>"
    }
}

client.on("ready", async () => {
    console.log(`Who dares summon ${client.user.username}? Oh, its creater. Please don't kill me.`)
    client.user.setActivity("$help for help")
})

client.on("messageCreate", (msg) => {
    if (!msg.author.bot && msg.content.startsWith(prefix)) {
        const [cmd, ...args] = msg.content.toLowerCase()
            .substring(prefix.length)
            .split(/\s+/)
        if (cmd === "help") {
            switch (args.length) {
                case 0:
                    commands.helpMenu(msg, commandDict)
                    break;
                case 1:
                    switch (args[0].toLowerCase()) {
                        case "dm":
                            if(msg.member.permissions.has('ADMINISTRATOR')) commands.helpEnemies(msg, enemyCommands, "DM", "dm")
                            else return msg.channel.send("This is meant for the dm")
                            break;
                        default:
                            commands.helpMenu(msg, commandDict, args[0])
                            break;
                    }
                    break;
                case 2:
                    switch (args[0].toLowerCase()) {
                        case "dm":
                            if(msg.member.permissions.has('ADMINISTRATOR')) commands.helpEnemies(msg, enemyCommands, "DM", "dm", args[1])
                            else return msg.channel.send("This is meant for the dm")
                            break;
                        default:
                            return msg.channel.send("Invalid arguments. Format: " + commandDict.help.format)
                    }
                    break;
                default:
                    return msg.channel.send("Invalid arguments. Format: " + commandDict.help.format)
            }
        }
        else if (cmd in commandDict) commandDict[cmd].commandFunc(msg, args, commandDict[cmd].format)
        else if (cmd in enemyCommands) enemyCommands[cmd].commandFunc(msg, args, enemyCommands[cmd].format)
    }
})

client.login(process.env.discordBotToken)
