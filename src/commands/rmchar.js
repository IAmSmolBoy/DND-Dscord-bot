const Character = require("../models/character")

module.exports = {
    name: "rmchar",
    description: "Removes a character based on the username",
    options: [
        {
            type: 3,
            name: "name",
            autocomplete: true,
            required: true,
            description: "The character's name",
        }
    ],
    autocomplete: async interaction => {
        return interaction.respond(
            (await Character.find({ "identifiers.guildID": interaction.member.guild.id }).lean())
                .map(char => {
                    return {
                        name: char.identifiers.username,
                        value: char.identifiers.username
                    }
                })
        )
    },
    execute: async (interaction) => {

        // Determine subcommand and retrieve command arguments
        const { _hoistedOptions } = interaction.options
        const username = _hoistedOptions[0].value

        await Character.findOneAndDelete({
            identifiers: {
                username,
                guildID: interaction.member.guild.id
            }
        },)

        // console.log(res)

        return interaction.reply(username + " sucessfully deleted")

    }
}

