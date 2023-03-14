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
    bm: {
        description: "Get ready, its time to play",
        format: "$bm <username> <intiative>",
        run: require("./commands/insertInit")
    },
    lvlup: {
        description: "Updates your max hp after you level up",
        format: "$lvlup <username> <hp increase>",
        run: require("./commands/levelUp")
    },
    view: {
        description: "Views profile",
        format: "$view <optional: username>",
        run: require("./commands/view")
    },
    summon: {
        description: "Sunmmons a creature in the middle of battle",
        format: "$summon <name> <max HP> <initiative> <optional: quantity>",
        run: require("./commands/summon")
    },
    ri: {
        description: "removes a creature from the initative list by index",
        format: "$ri <index>",
        run: require("./commands/removeInit"),
        admin: true
    },
    addenemy: {
        description: "adds specified number of enemies with specified health",
        format: "$addenemy <Battle Name> <Enemy name> <initiative modifier> <optional: no. of enemies>",
        run: require("./commands/addEnemy"),
        admin: true
    },
    battle: {
        description: "The time for mercy has passed >:)",
        format: "$battle <optional: battle name>",
        run: require("./commands/initbattle"),
        admin: true
    },
    viewbattles: {
        description: "View battles and the enemies inside",
        format: "$viewbattles <optional: battle name>",
        run: require("./commands/viewBattles"),
        admin: true
    },
    end: {
        description: "Ends the ongoing battle and deletes the battle instance",
        format: "$end <optional: battle name>",
        run: require("./commands/endBattle"),
        admin: true
    },
}

module.exports = commandList