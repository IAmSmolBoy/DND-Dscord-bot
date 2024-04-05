const Battle = require("../models/battle")

module.exports = {
    name: "startbattle",
    description: "Starts a battle",
    options: [
        {
            type: 3,
            name: "battle",
            description: "Name of the battle you want to start",
            autocomplete: true
        }
    ],
    autocomplete: async interaction => {

        const battles = await Battle.find({ "identifiers.guildID": guildId }).lean()

        return await interaction.respond(
            battles
                .map(battle => {
                    return {
                        name: battle.name,
                        value: battle.name
                    }
                })
        )

    },
    execute: async (interaction) => {

        const battles = await Battle.find({ "identifiers.guildID": guildId }).lean()
        const { _hoistedOptions } = interaction.options

        return await interaction.reply("<insert code>")

    }
}

