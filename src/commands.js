const Char = require("./models/character"), Enemy = require("./models/enemy"), Task = require("./models/task")
const { MessageEmbed } = require('discord.js');
var prefix = "$"

function clear(msg, args, format) {
    if (args.length != 1 || isNaN(args[0])) return msg.channel.send("Invalid arguments. Format: " + format)
    else if (args >= 100) return msg.channel.send("The limit is 99")
    // else if (!msg.member.permissions.has('ADMINISTRATOR')) return msg.channel.send("Too bad. U need admin to delete :(")
    else {
        msg.channel
            .bulkDelete(parseInt(args[0]) + 1)
            .catch(err => {
                console.log(err)
                return msg.channel.send("Oh god, what is happ_ **explosion**\nU cannot delete messages that are more than 14 days old.")
            })
    }
}

async function addCharacter(msg, args, format) {
    const existing = await Char.findOne({ username: args[0] })
    if (args.length != 2 || isNaN(args[1])) return msg.channel.send("Invalid arguments. Format: " + format)
    else if (existing) return msg.channel.send("Character already exists")
    else {
        const username = args[0], maxHP = args[1], currHP = args[1]
        var character = new Char({ username, maxHP, currHP})
        await character.save()
        return msg.channel.send(`${args[0]} added`)
    }
}

async function removeCharacter(msg, args, format) {
    const existing = await Char.findOne({ username: args[0] })
    if (args.length != 1) return msg.channel.send("Invalid arguments. Format: " + format)
    else if (!existing) return msg.channel.send("Character does not exist")
    else {
        await Char.deleteOne({ username: args[0] })
        return msg.channel.send(`${args[0]} removed`)
    }
}

function diceRoll(msg, args, format) {
    const argChecker = args.length > 2 || args.length < 1 || !args[0].includes("d") || args[0].split("d")[1] === ""
    if (argChecker) return msg.channel.send("Invalid arguments. Format: " + format)
    else {
        var [ diceNum, sides ] = args[0].split("d")
        if (diceNum === "") diceNum = 1
        var ranNumList = [], totalRoll = 0
        for (i = 0 ; i < diceNum; i++) {
            var ranNum = Math.round(Math.random() * parseInt(sides - 1) + 1)
            ranNumList.push(`(${ranNum})`)
            totalRoll += ranNum
        }
        if (args[1]) {
            totalRoll += parseInt(args[1])
            ranNumList.push(args[1])
        }
        var rollMsg = ranNumList.join(" + ")
        msg.channel.send(rollMsg + ` = ${totalRoll}`)
        return totalRoll
    }
}

async function dealDmgOrHeal(msg, args, format) {
    const [ cmd ] = msg.content.toLowerCase()
        .substring(prefix.length)
        .split(/\s+/)
    var increment = parseInt(args[1])
    if (args.length != 2 || isNaN(args[1])) return msg.channel.send("Invalid arguments. Format: " + format)
    else if (cmd === "dmg") increment *= -1

    characterSheet = await Char.findOne({ username: args[0] })
    if (!characterSheet) characterSheet = await Enemy.findOne({ monsterId: args[0] })
    if (!characterSheet) return msg.channel.send("Entity not found")

    var newHP = characterSheet.currHP + increment
    if (newHP > characterSheet.maxHP) newHP = characterSheet.maxHP
    else if (newHP < 0) newHP = 0

    if (!characterSheet.username) await Enemy.findOneAndUpdate({ monsterId: args[0] }, { currHP: newHP })
    else await Char.findOneAndUpdate({ username: args[0] }, { currHP: newHP })
    
    var options = { limit: 100 }, lastMsgs, embedMsgs;
    for (i = 0; i < 3; i++) {
        if (lastMsgs) options.before = lastMsgs.last().id
        lastMsgs = await msg.channel.messages.fetch(options)
        embedMsgs = lastMsgs.filter((e) => {
            if (e.embeds[0]) return e.embeds[0].title === "Initiative"
            return false
        })
        if (embedMsgs.size !== 0) break
    }
    if (embedMsgs.size === 0) return msg.channel.send(`${args[0]}'s HP is now ${newHP}`)
    else {
        var msgId, embed, fields;
        embedMsgs.forEach(e => {
            if (!msgId) {
                msgId = e.id
                embed = e.embeds[0]
                fields = embed.fields
            }
        })
        const entityName = characterSheet.username || characterSheet.monsterId, charFieldIndex = fields.map((e) => e.name).indexOf(entityName)
        if (newHP === 0 && characterSheet.monsterId) {
            fields.splice(charFieldIndex, 1)
            await Enemy.deleteOne({ monsterId: entityName })
        }
        else fields[charFieldIndex].value = `${newHP}/${characterSheet.maxHP}\n${fields[charFieldIndex].value.split("\n")[1]}`
        embed.fields = fields
        const latestBattle = await msg.channel.messages.fetch(msgId)
        return latestBattle.edit({embeds: [embed]})
    }
}

function helpMenu(msg, commandDict, pageNo = 1) {
    var helpMenu = []
    if (isNaN(pageNo)) {
        if (!(pageNo in commandDict)) return msg.channel.send("Command not found")
        else {
            return msg.channel.send(`${pageNo[0].toUpperCase() + pageNo.slice(1) + ":"}
        \tDescription: ${commandDict[pageNo].description}
        \tFormat: ${commandDict[pageNo].format}`)
        }
    }
    if (pageNo !== 1) pageNo = parseInt(pageNo)
    Object.entries(commandDict).forEach(([key, value], i) => {
        if (i >= 6 * (pageNo - 1) && i < 6 * pageNo) {
            helpMenu.push(key[0].toUpperCase() + key.slice(1) + ":")
            helpMenu.push(`\tDescription: ${value["description"]}`)
            helpMenu.push(`\tFormat: ${value["format"]}\n`)
        }
    });
    var helpText = helpMenu.join("\n")
    if (pageNo * 6 < Object.keys(commandDict).length) helpText += `\nUse $help ${pageNo + 1} for the next page`
    return msg.channel.send(`**Command Guide Page ${pageNo}**\n` + helpText)
}

async function longRest(msg, args, format) {
    const allChars = await Char.find()
    if (args.length > 0) return msg.channel.send("Invalid arguments. Format: " + format)
    allChars.forEach(async (e) => {
        await Char.findOneAndUpdate({ username: e.username }, { currHP: e.maxHP })
    })
    return msg.channel.send("The party is rested and has regained all their HP");
}

async function shortRest(msg, args, format) {
    console.log(args[1].indexOf("d"))
    if (args.length > 3 || args.length < 2 || args[1].indexOf("d") === -1 || isNaN(args[2])) return msg.channel.send("Invalid arguments. Format: " + format)
    const charSheet = await Char.findOne({ username: args[0] })
    if (!charSheet) return msg.channel.send("Character was not found.")
    msg.channel.send("Rolling for hp healed...")
    var healing = diceRoll(msg, args.slice(1), format)
    if (healing + charSheet.currHP > charSheet.maxHP) healing = charSheet.maxHP - charSheet.currHP 
    await Char.findOneAndUpdate({ username: args[0] }, { currHP: charSheet.currHP + healing })
    return msg.channel.send(`${args[0]}'s HP is now ${healing + charSheet.currHP}. Healing received: ${healing}`)
}

async function battleMode(msg, args, format) {
    if (args.length !== 2 || isNaN(args[1])) return msg.channel.send("Invalid arguments. Format: " + format)
    var prevMsgs = await msg.channel.messages.fetch(), options = { limit: 100 }, embedMsgs;
    for (i = 0; i < 3; i++) {
        if (i !== 0) options.before = prevMsgs.last().id
        embedMsgs = prevMsgs.filter(e => {
            if (e.embeds[0]) return e.embeds[0].title === "Initiative"
            return false
        })
        if (embedMsgs.size !== 0) break
        prevMsgs = await msg.channel.messages.fetch(options)
    }
    if (embedMsgs.size === 0) return msg.channel.send("The land looks barren, no enemies in sight. Either that, or your battle has been going on forever. Its too far back")

    const latestBattle = [...embedMsgs][0][1]
    var fields = latestBattle.embeds[0].fields
    const initList = fields.map((e) => parseInt(e.value.slice(e.value.length - 2))), char = await Char.findOne({ username: args[0] })
    if (initList.includes(parseInt(args[1]))) return msg.channel.send("Initiative already exists")
    else if (!char) return msg.channel.send("Character not found")
    else if (fields.map(e => e.name).includes(args[0])) return msg.channel.send("You cannot go twice")
    initList.push(parseInt(args[1]))
    initList.sort((first, second) => second - first)
    const initIndex = initList.indexOf(parseInt(args[1]))
    fields.splice(initIndex, 0, {
        name: args[0],
        value: `${char.currHP}/${char.maxHP}\nInitiative: ${args[1]}`,
        inline: false
    })
    latestBattle.embeds[0].fields = fields
    const newEmbed = latestBattle.embeds
    const battleMsg = await msg.channel.messages.fetch(latestBattle.id)
    battleMsg.edit({ embeds: newEmbed })
}

async function levelUp(msg, args, format) {
    if (args.length !== 2 || isNaN(args[1])) return msg.channel.send("Invalid arguments. Format: " + format)
    else if (!(await Char.findOne({ username: args[0] }))) return msg.channel.send("Character not found")
    else {
        const oldChar = await Char.findOne({ username: args[0] })
        const newChar = await Char.findOneAndUpdate({ username: args[0] }, { maxHP: oldChar.maxHP + parseInt(args[1]), currHP: oldChar.maxHP + parseInt(args[1]) }, { new: true })
        return msg.channel.send(`${newChar.username}'s max hp is now ${newChar.maxHP}`)
    }
}

async function view(msg, args, format) {
    var mongoQuery = {}
    if (args.length > 1) return msg.channel.send("Invalid arguments. Format: " + format)
    else {
        if (args.length === 1) mongoQuery.username = args[0]
        const char = await Char.find(mongoQuery)
        if (!char) return msg.channel.send("Character not found")
        else {
            char.forEach(char => {
                const embed = new MessageEmbed()
                .setColor('#00FF00')
                .setTitle(char.username)
                embed.addFields([
                    {
                        name: "HP",
                        value: `${char.currHP}/${char.maxHP}`,
                        inline: false
                    }
                ])
                msg.channel.send({ embeds: [embed] })
            })
        }
    }
}



function helpEnemies(msg, enemyDict, helpSpec, pageNo = 1) {
    var helpMenu = []
    if (isNaN(pageNo)) {
        if (pageNo in enemyDict) return msg.channel.send(`${pageNo[0].toUpperCase() + pageNo.slice(1) + ":"}
        \tDescription: ${enemyDict[pageNo].description}
        \tFormat: ${enemyDict[pageNo].format}`)
        else {
            return msg.channel.send("Command not found")
        }
    }
    
    if (pageNo !== 1) pageNo = parseInt(pageNo)
    Object.entries(enemyDict).forEach(([key, value], i) => {
        if (i >= 6 * (pageNo - 1) && i < 6 * pageNo) {
            helpMenu.push(key[0].toUpperCase() + key.slice(1) + ":")
            helpMenu.push(`\tDescription: ${value["description"]}`)
            helpMenu.push(`\tFormat: ${value["format"]}\n`)
        }
    });
    var helpText = helpMenu.join("\n")
    if (pageNo * 6 < Object.keys(enemyDict).length) helpText += `\nUse $help ${pageNo + 1} for the next page`
    return msg.channel.send(`**${helpSpec} Guide Page ${pageNo}**\n` + helpText)
}

async function addEnemy(msg, args, format) {
    const existingEnemies = await Enemy.find({ type: args[0] })
    if (args.length < 3 || args.length > 4) return msg.channel.send("Invalid arguments. Format: " + format)
    else {
        for (const [i, e] of args.entries()) {
            if (isNaN(e) && i > 0) return msg.channel.send("Invalid arguments. Format: " + format)
        }
        var times = args[3]
        if (!times) times = 1
        for (i = 0; i < parseInt(times); i++) {
            const type = args[0], index = existingEnemies.length + i, maxHP = args[1], currHP = args[1], initMod = args[2]
            const monsterId = type + index
            var enemy = new Enemy({ monsterId, type, index, initMod, maxHP, currHP })
            await enemy.save()
        }
        return msg.channel.send(`${times} ${args[0]}(s) added`)
    }
}

async function battle(msg, args, format) {
    const enemies = await Enemy.find()
    if (enemies.length === 0) return msg.channel.send("No enemies to be seen")
    const enemyNames = enemies.map(({monsterId}) => monsterId)
    const enemyNameText = `Enemies: ${enemyNames.join(", ")}`

    var initiatives = {}
    var battleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle("Initiative")
    enemies.forEach((e) => {
        var d20 = diceRoll(msg, [`d20`, `${e.initMod}`], format)
        while (d20 in initiatives) d20 = diceRoll(msg, [`d20`, `${e.initMod}`], format)
        initiatives[parseInt(d20)] = e
    })
    var rolls = Object.keys(initiatives)
    rolls.sort((first, second) => second - first)
    for (i of rolls) battleEmbed.addField(initiatives[i].monsterId, `${initiatives[i].currHP}/${initiatives[i].maxHP}
    Initiative: ${i}`)
    msg.channel.send(enemyNameText)
    return msg.channel.send({ embeds: [battleEmbed] })
}

async function reset(msg, args, format) {
    await Enemy.deleteMany({})
    var options = { limit: 100 }, lastMsgs, embedMsgs;
    for (i = 0; i < 3; i++) {
        if (i !== 0) options.before = lastMsgs.last().id
        lastMsgs = await msg.channel.messages.fetch(options)
        embedMsgs = lastMsgs.filter((e) => e.embeds.length > 0)
        if (embedMsgs.length !== 0) break
    }
    embedMsgs.forEach(e => {
        e.delete()
    })
    msg.channel.send("Battlefield reset")
}




async function addDeadline(msg, args, format) {
    if (args.length !== 4 || args[0].split("/").length !== 3 || args[1].split(":").length !== 3) {
        return msg.channel.send("Invalid arguments. Format: " + format)
    }
    else {
        var taskDateTime = args[0].split("/").concat(args[1].split(":"))
        if (taskDateTime.includes("") || taskDateTime.filter((e) => !isNaN(e)).length !== 6 || taskDateTime[2].length !== 4) {
            return msg.channel.send("Invalid arguments. Format: " + format)
        }
        taskDateTime = taskDateTime.map((e) => {
            if (e.length < 2) return "0" + e
            else return e
        })
        const dateTimeFormatted = `${taskDateTime.slice(0, 3).reverse().join("-")}T${taskDateTime.slice(3).join(":")}`
        const msgContent = args[2], reminderModifiers = [{date: 4, hour: 16}, {hour: 16}, {hour: -3}], role = args[3]
        reminderModifiers.forEach(async (e, i) => {
            var dateTime = new Date(dateTimeFormatted), deadline = new Date(dateTimeFormatted)
            for (const [ mod, modVal ] of Object.entries(e)) {
                switch (mod) {
                    case "date":
                        dateTime.setDate(dateTime.getDate() - modVal)
                        break;
                    case "hour":
                        dateTime.setHours(dateTime.getHours() - modVal)
                        break;
                }
            }
            const channel = msg.channel.id, guild = msg.guild.id
            const task = new Task({ dateTime, msgContent, role, deadline, channel, guild })
            await task.save()
        })
    }
}

module.exports = {
    clear, addCharacter, removeCharacter, diceRoll, dealDmgOrHeal, helpMenu,
    longRest, shortRest, battleMode, levelUp, view, helpEnemies, addEnemy,
    battle, reset, addDeadline
}