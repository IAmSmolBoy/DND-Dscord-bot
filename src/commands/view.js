const Character = require("../models/character")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: {
		name: "view",
		description: 'view all characters',
		options: [
			{
				type: 3,
				name: "name",
				description: "The character's name",
				autocomplete: true,
			}
		]
	},
	execute: async interaction => {

		// console.log(interaction)

		const { _hoistedOptions } = interaction.options

        var embedOptions = {
            title: "CHARACTERS",
            color: "#e84f64",
            description: "These are the characters in this server",
            fields: []
        }

		if (_hoistedOptions.length > 0) {
			return await interaction.reply("<insert working code>")
		}

		(await Character.find().lean())
			.map(char => {
				return {
					
				}
			})

		// console.log(characters)



		return await interaction.reply({
			embeds: [
				new MessageEmbed(embedOptions)
			]
		});
	},
};