const Char = require("./models/character")
var prefix = "$"

function clear(msg, args, format) {
    if (args.length != 1 || isNaN(args[0])) return msg.channel.send("Invalid arguments. Format: " + format)
    else if (args >= 100) return msg.channel.send("The limit is 99")
    else if (!msg.member.permissions.has('ADMINISTRATOR')) return msg.channel.send("Too bad. U need admin to delete :(")
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
        var character = new Char({ username, maxHP, currHP })
        var savedUser = await character.save()
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
        var rollMsg = ranNumList.join(" + ")
        if (args[1]) {
            totalRoll += parseInt(args[1])
            rollMsg += " + " + args[1]
        }
        msg.channel.send(rollMsg + ` = ${totalRoll}`)
        return totalRoll
    }
}

async function dealDmgOrHeal(msg, args, format) {
    const [ cmd ] = msg.content
        .substring(prefix.length)
        .split(/\s+/)
    var increment = parseInt(args[1]), characterSheet = await Char.findOne({ username: args[0] })
    if (args.length != 2 || isNaN(args[1])) return msg.channel.send("Invalid arguments. Format: " + format)
    else if (cmd === "dealDmg") increment *= -1
    var newHP = characterSheet.currHP + increment
    if (newHP > characterSheet.maxHP) newHP = characterSheet.maxHP
    await Char.findOneAndUpdate({ username: args[0] }, { currHP: newHP })
    return msg.channel.send(`${args[0]}'s HP is now ${newHP}`)
}

function helpMenu(msg, commandDict, pageNo = 1) {
    var helpMenu = []
    if (pageNo !== 1) pageNo = parseInt(pageNo)
    Object.entries(commandDict).forEach(([key, value], i) => {
        if (i > 6 * (pageNo - 1) && i < 6 * pageNo) {
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
    if (args.length != 2) return msg.channel.send("Invalid arguments. Format: " + format)
    const charSheet = await Char.findOne({ username: args[0] })
    if (!charSheet) return msg.channel.send("Character was not found.")
    msg.channel.send("Rolling for hp healed...")
    var healing = diceRoll(msg, args.slice(1), format)
    if (healing + charSheet.currHP > charSheet.maxHP) healing = charSheet.maxHP - charSheet.currHP 
    await Char.findOneAndUpdate({ username: args[0] }, { currHP: charSheet.currHP + healing })
    return msg.channel.send(`${args[0]}'s HP is now ${healing + charSheet.currHP}. Healing received: ${healing}`)
}

// function 

module.exports = {clear, addCharacter, removeCharacter, diceRoll, dealDmgOrHeal, helpMenu, longRest, shortRest}