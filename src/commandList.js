/*                         Imports                         */
const fs = require("fs")







/*                         Specifying Commands                         */
const commandList = {
    help: {
        description: "Helps you :)",
        format: "$help <optional: command name>",
        run: require("./commands/help")
    },
    clear: {
        description: "Deletes specified number of messages", 
        format: "$clear <number of messages to delete>",
        run: require("./commands/clear")
    },
    add: {
        description: "Adds a character with the specified max HP",
        format: "$add <username> <max HP>",
        run: require("./commands/add")
    },
    remove: {
        description: "Removes the specified character",
        format: "$remove <username>",
        run: require("./commands/remove")
    },
    r: {
        description: "Rolls a dice and with the specified number of sides, number of die and the procifiency bonus",
        format: "$r <optional: no. of die>d<no. of sides> <optional: proficiency>",
        run: require("./commands/roll")
    },
    dmg: {
        description: "deals dmg to the specified character or entity",
        format: "$dmg <username> <damage dealt>",
        run: require("./commands/modifyHP")
    },
    heal: {
        description: "heals the specified character or entity",
        format: "$heal <username> <hp healed>",
        run: require("./commands/modifyHP")
    },
    lr: {
        description: "The party rests for a long time and regains all their HP",
        format: "$lr",
        run: require("./commands/longRest")
    },
    // bm: {
    //     description: "Get ready, its time to play",
    //     format: "$bm <username> <intiative>"
    // },
    // lvlup: {
    //     description: "Updates your max hp after you level up",
    //     format: "$lvlup <username> <hp increase>"
    // },
    // view: {
    //     description: "Views profile",
    //     format: "$view <optional: username>"
    // },
    // summon: {
    //     description: "Sunmmons a creature in the middle of battle",
    //     format: "$summon <name> <hp> <initiative> <quantity> <optional: owner>"
    // },
    // removeinit: {
    //     description: "removes a creature from the initative list by index",
    //     format: "$removeinit <index>"
    // },
    // addenemy: {
    //     description: "adds specified number of enemies with specified health",
    //     format: "$addenemy <enemy type> <max HP> <initiative modifier> <optional: no. of enemies>"
    // },
    // battle: {
    //     description: "Enters battle mode for enemies",
    //     format: "$battle"
    // },
    // reset: {
    //     description: "Resets the battlefield and deletes all monsters",
    //     format: "$reset"
    // },
    startcampaign: {
        description: "Resets the battlefield and deletes all monsters",
        format: "$startcampaign <Campaign Name>"
    }
}

module.exports = commandList







// async function shortRest(msg, args, format) {
//     if (args.length > 3 || args.length < 2 || args[1].indexOf("d") === -1 || isNaN(args[2])) return msg.channel.send("Invalid arguments. Format: " + format)
//     const charSheet = await Char.findOne({ username: args[0] })
//     if (!charSheet) return msg.channel.send("Character was not found.")
//     msg.channel.send("Rolling for hp healed...")
//     var healing = diceRoll(msg, args.slice(1), format)
//     if (healing + charSheet.currHP > charSheet.maxHP) healing = charSheet.maxHP - charSheet.currHP 
//     await Char.findOneAndUpdate({ username: args[0] }, { currHP: charSheet.currHP + healing })
//     return msg.channel.send(`${args[0]}'s HP is now ${healing + charSheet.currHP}. Healing received: ${healing}`)
// }

// async function battleMode(msg, args, format) {
//     if (args.length !== 2 || isNaN(args[1])) return msg.channel.send("Invalid arguments. Format: " + format)
//     var prevMsgs = await msg.channel.messages.fetch(), options = { limit: 100 }, embedMsgs;
//     for (i = 0; i < 3; i++) {
//         if (i !== 0) options.before = prevMsgs.last().id
//         embedMsgs = prevMsgs.filter(e => {
//             if (e.embeds[0]) return e.embeds[0].title === "Initiative"
//             return false
//         })
//         if (embedMsgs.size !== 0) break
//         prevMsgs = await msg.channel.messages.fetch(options)
//     }
//     if (embedMsgs.size === 0) return msg.channel.send("The land looks barren, no enemies in sight. Either that, or your battle has been going on forever. Its too far back")

//     const latestBattle = [...embedMsgs][0][1]
//     var fields = latestBattle.embeds[0].fields
//     const char = await Char.findOne({ username: args[0] })
//     if (!char) return msg.channel.send("Character not found")
//     else if (fields.map(e => e.name).includes(args[0])) {
//         for (i in fields) if (fields[i].name === args[0]) {
//             fields.splice(i, 1)
//         }
//     }
//     const initList = fields.map((e) => parseInt(e.value.slice(e.value.length - 2)))
//     initList.push(parseInt(args[1]))
//     initList.sort((first, second) => second - first)
//     const initIndex = initList.indexOf(parseInt(args[1]))
//     fields.splice(initIndex, 0, {
//         name: args[0],
//         value: `${char.currHP}/${char.maxHP}\nInitiative: ${args[1]}`,
//         inline: false
//     })
//     latestBattle.embeds[0].fields = fields
//     const newEmbed = latestBattle.embeds
//     const battleMsg = await msg.channel.messages.fetch(latestBattle.id)
//     battleMsg.edit({ embeds: newEmbed })
// }

// async function levelUp(msg, args, format) {
//     if (args.length !== 2 || isNaN(args[1])) return msg.channel.send("Invalid arguments. Format: " + format)
//     else if (!(await Char.findOne({ username: args[0] }))) return msg.channel.send("Character not found")
//     else {
//         const oldChar = await Char.findOne({ username: args[0] })
//         const newChar = await Char.findOneAndUpdate({ username: args[0] }, { maxHP: oldChar.maxHP + parseInt(args[1]) }, { new: true })
//         return msg.channel.send(`${newChar.username}'s max hp is now ${newChar.maxHP}`)
//     }
// }

// async function view(msg, args, format) {
//     var mongoQuery = {}
//     if (args.length > 1) return msg.channel.send("Invalid arguments. Format: " + format)
//     else {
//         if (args.length === 1) mongoQuery.username = args[0]
//         const char = await Char.find(mongoQuery)
//         if (char.length === 0) return msg.channel.send("Character not found")
//         else {
//             char.forEach(char => {
//                 const embed = new MessageEmbed()
//                 .setColor('#00FF00')
//                 .setTitle(char.username)
//                 embed.addFields([
//                     {
//                         name: "HP",
//                         value: `${char.currHP}/${char.maxHP}`,
//                         inline: false
//                     }
//                 ])
//                 msg.channel.send({ embeds: [embed] })
//             })
//         }
//     }
// }



// function helpEnemies(msg, enemyDict, helpSpec, spec, pageNo = 1) {
//     var helpMenu = []
//     if (isNaN(pageNo)) {
//         if (pageNo in enemyDict) return msg.channel.send(`${pageNo[0].toUpperCase() + pageNo.slice(1) + ":"}
//         \tDescription: ${enemyDict[pageNo].description}
//         \tFormat: ${enemyDict[pageNo].format}`)
//         else {
//             return msg.channel.send("Command not found")
//         }
//     }
    
//     if (pageNo !== 1) pageNo = parseInt(pageNo)
//     Object.entries(enemyDict).forEach(([key, value], i) => {
//         if (i >= 6 * (pageNo - 1) && i < 6 * pageNo) {
//             helpMenu.push(key[0].toUpperCase() + key.slice(1) + ":")
//             helpMenu.push(`\tDescription: ${value["description"]}`)
//             helpMenu.push(`\tFormat: ${value["format"]}\n`)
//         }
//     });
//     var helpText = helpMenu.join("\n")
//     if (pageNo * 6 < Object.keys(enemyDict).length) helpText += `\nUse $help ${spec} ${pageNo + 1} for the next page`
//     return msg.channel.send(`**${helpSpec} Guide Page ${pageNo}**\n` + helpText)
// }

// async function addEnemy(msg, args, format) {
//     const existingEnemies = await Enemy.find({ type: args[0] })
//     if (args.length < 3 || args.length > 4) return msg.channel.send("Invalid arguments. Format: " + format)
//     else {
//         for (const [i, e] of args.entries()) {
//             if (isNaN(e) && i > 0) return msg.channel.send("Invalid arguments. Format: " + format)
//         }
//         var times = args[3]
//         if (!times) times = 1
//         for (i = 0; i < parseInt(times); i++) {
//             const type = args[0], index = existingEnemies.length + i + 1, maxHP = args[1], currHP = args[1], initMod = args[2]
//             const monsterId = type + index
//             var enemy = new Enemy({ monsterId, type, index, initMod, maxHP, currHP })
//             await enemy.save()
//         }
//         return msg.channel.send(`${times} ${args[0]}(s) added`)
//     }
// }

// async function battle(msg, args, format) {
//     const enemies = await Enemy.find()
//     if (enemies.length === 0) return msg.channel.send("No enemies to be seen")
//     const enemyNames = enemies.map(({monsterId}) => monsterId)
//     const enemyNameText = `Enemies: ${enemyNames.join(", ")}`

//     var initiatives = {}
//     var battleEmbed = new MessageEmbed()
//         .setColor('#0099ff')
//         .setTitle("Initiative")
//     enemies.forEach((e) => {
//         var d20 = diceRoll(msg, [`d20`, `${e.initMod}`], format)
//         while (d20 in initiatives) d20 = diceRoll(msg, [`d20`, `${e.initMod}`], format)
//         initiatives[parseInt(d20)] = e
//     })
//     var rolls = Object.keys(initiatives)
//     rolls.sort((first, second) => second - first)
//     for (i of rolls) battleEmbed.addField(initiatives[i].monsterId, `${initiatives[i].currHP}/${initiatives[i].maxHP}
//     Initiative: ${i}`)
//     msg.channel.send(enemyNameText)
//     return msg.channel.send({ embeds: [battleEmbed] })
// }

// async function reset(msg, args, format) {
//     await Enemy.deleteMany({})
//     var options = { limit: 100 }, lastMsgs, embedMsgs;
//     for (i = 0; i < 3; i++) {
//         if (i !== 0) options.before = lastMsgs.last().id
//         lastMsgs = await msg.channel.messages.fetch(options)
//         embedMsgs = lastMsgs.filter((e) => e.embeds.length > 0)
//         if (embedMsgs.length !== 0) break
//     }
//     embedMsgs.forEach(e => {
//         e.delete()
//     })
//     msg.channel.send("Battlefield reset")
// }

// module.exports = {
//     clear, addCharacter, removeCharacter, diceRoll, dealDmgOrHeal, helpMenu, longRest,
//     shortRest, battleMode, levelUp, view, helpEnemies, addEnemy, battle, reset
// }