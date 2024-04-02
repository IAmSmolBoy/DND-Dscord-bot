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
			(await Character.find({ "identifiers.guildID": interaction.member.guild.id }).lean())
				.map(char => {
					return {
						name: char.identifiers.username,
						value: char.identifiers.username
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

			const character = await Character.findOne({
				identifiers: {
					username: _hoistedOptions[0].value,
					guildID: interaction.member.guild.id
				}
			})

			embedOptions = {
				...embedOptions,
				title: character.identifiers.username,
				description: `${character.currHP}/${character.maxHP} temp HP: ${character.tempHP}`
			}



			if ("skillChecks" in character) {
				embedOptions.fields = Object.entries(character.skillChecks)
					.map(skill => {
						return {
							name: skill[0],
							value: `+ ${skill[1]}`,
							inline: true
						}
					})

				embedOptions.fields
					.splice(0, 0, {
						name: "Skill Checks",
						value: "Modifiers for your skill checks",
					})
			}

			// return await interaction.reply("<insert working code>")

		}
		else {

			const characters = await Character.find({ "identifiers.guildID": interaction.member.guild.id }).lean()

			if (characters.length === 0) {
				embedOptions = {
					...embedOptions,
					title: "Wow, such empty",
					description: "There are no characters in this server",
				}
			}
			else {
				embedOptions.fields = characters
					.map(char => {
						return {
							name: char.identifiers.username,
							value: `${char.currHP}/${char.maxHP}`
						}
					})
			}

		}

		return await interaction.reply({
			embeds: [
				new MessageEmbed(embedOptions)
			]
		});
	},
};