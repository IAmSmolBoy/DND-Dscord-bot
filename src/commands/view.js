const Character = require("../models/character")
const { MessageEmbed } = require("discord.js")

module.exports = {
	name: "view",
	description: 'view all characters',
	options: [
		{
			type: 3,
			name: "name",
			description: "The character's name",
			autocomplete: true,
		}
	],
	autocomplete: async interaction => {
		interaction.respond(
			(await Character.find().lean())
				.map(char => {
					return {
						name: char.username,
						value: char.username
					}
				})
		)
	},
	execute: async interaction => {

		const { _hoistedOptions } = interaction.options

        var embedOptions = {
            title: "CHARACTERS",
            color: "#74c9de",
            description: "These are the characters in this server",
			fields: []
        }

		if (_hoistedOptions.length > 0) {

			const username = _hoistedOptions[0].value
			const character = await Character.findOne({
				username,
				guildID: interaction.member.guild.id
			})

			embedOptions = {
				...embedOptions,
				title: character.username,
				description: `${character.currHP}/${character.maxHP} temp HP: ${character.tempHP}`
			}

			// return await interaction.reply("<insert working code>")

		}
		else {

			embedOptions.fields = (await Character.find({ guildID: interaction.member.guild.id }).lean())
				.map(char => {
					return {
						name: char.username,
						value: `${char.currHP}/${char.maxHP}`
					}
				})

		}

		return await interaction.reply({
			embeds: [
				new MessageEmbed(embedOptions)
			]
		});
	},
};