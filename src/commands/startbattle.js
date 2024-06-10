const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js")

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

        const battles = await Battle.find({ "identifiers.guildID": interaction.guildId }).lean()

        return await interaction.respond(
            battles
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

        var identifiers = { "identifiers.guildID": interaction.guildId }

        const battleOption = _hoistedOptions.find(option => option.name === "battle")

        if (_hoistedOptions.length > 0 || battleOption) {
            identifiers.name = battleOption.value
        }

        const battle = await Battle.findOne(identifiers).lean()

        const rollsEmbedOptions = {
            title: "Initiative Rolls",
            color: "#9aba71",
            description: "These are the enemies' initiative rolls",
			fields: []
        }
        
        const battleEmbedOptions = {
            title: battle.identifiers.name,
            color: "#e84f64",
			fields: []
        }

        await interaction.reply({
            embeds: [ new MessageEmbed(rollsEmbedOptions) ]
        })

        for (const enemy of battle.enemies) {

            const roll = Math.ceil(Math.random() * 20)
            const total = roll + enemy.mod

            rollsEmbedOptions.fields.push({
                name: `${enemy.name}`,
                value: `(${roll}) + ${enemy.mod} = ${total}`,
                inline: true
            })

            battleEmbedOptions.fields.push({
                name: `${enemy.name}`,
                value: `Initiative: ${total}`
            })

            await interaction.editReply({
                embeds: [ new MessageEmbed(rollsEmbedOptions) ]
            })

        }

        // const buttonOptions = {
        //     label: "Remove Initiative",
        //     custom_id: "ri",
        //     style: 1
        // }

        return await interaction.editReply({
            embeds: [
                new MessageEmbed(rollsEmbedOptions),
                new MessageEmbed(battleEmbedOptions),
            ],
			// components: [
            //     new MessageActionRow({
            //         components: [
            //             new MessageButton(buttonOptions),
                            
            //         ]
            //     })
            // ],
        })

    }
}