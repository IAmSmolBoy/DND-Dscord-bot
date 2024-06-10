const Battle = require("../models/battle")

module.exports = {
    name: "addenemy",
    description: "Add an enemy",
    options: [
        {
            type: 3,
            name: "name",
            description: "Name of enemy",
            required: true,
        },
        {
            type: 4,
            name: "initmod",
            description: "Initiative modifier of the enemy",
            required: true,
        },
        {
            type: 3,
            name: "battlename",
            description: "Name of the battle",
            autocomplete: true,
            default: "Battle"
        },
        {
            type: 4,
            name: "enemynum",
            description: "The nubmer of enemies",
            default: 1
        }
    ],
    autocomplete: async (interaction) => {

        return await interaction.respond(
            (await Battle.find({ "identifiers.guildID": interaction.guildId }).lean())
                .map(battle => {
                    return {
                        name: battle.identifiers.name,
                        value: battle.identifiers.name
                    }
                })
        )

    },
    execute: async (interaction) => {
    
        const { _hoistedOptions } = interaction.options

        // Extract arguments from _hoistedOptions and converts values from string to integer if needed
        const args = Object.fromEntries(
            _hoistedOptions
                .map(
                    arg =>
                        [
                            arg.name,
                            arg.type === "INTEGER" ?
                                parseInt(arg.value) :
                                arg.value
                        ]
                )
        )

        if (!("battlename" in args)) args.battlename = "Battle"
        if (!("enemynum" in args)) args.enemynum = 1

        const identifiers = {
            name: args.battlename,
            guildID: interaction.guildId
        }

        var battle = await Battle.findOne({ identifiers }, { "_id": false }).lean()

        if (!battle) {
            battle = await Battle({
                identifiers,
                enemies: []
            }).save()
        }

        var startNum = 0
        const sameEnemies = battle.enemies
            .filter(enemy => enemy.name.split(" - ")[0] === args.name)

        if (sameEnemies.length > 0) {
            startNum = parseInt(sameEnemies[sameEnemies.length - 1].split(" - ")[1])
        }

        for (i = startNum; i < args.enemynum + startNum; i++) {
            battle.enemies.push({
                name: args.name + ` - ${i + 1}`,
                mod: args.initmod
            })
        }
        
        await Battle.findOneAndUpdate(
            { identifiers },
            battle
        )

        return await interaction.reply(`${args.enemynum} ${args.name}${args.enemynum > 1 ? "s" : ""} successfully added to ${args.battlename}`)

    }
}

