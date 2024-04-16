const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: "test",
    description: "Just a command made for testing purposes",
    onSelect: async interaction => {
        
        console.log(interaction.values)

        return await interaction.reply("<insert code>")
    },
    execute: async interaction => {
        const select = new MessageSelectMenu({
            customId: 'starter',
            placeholder: 'Make aselection!',
            max_values: 2,
            options: [
                {
                    label: 'Bulbasaur',
                    description: 'The dual-type Grass/Poison Seed Pokémon.',
                    value: 'bulbasaur',
                },
                {
                    label: 'Bulbasaur 2',
                    description: 'The dual-type Grass/Poison Seed Pokémon.',
                    value: 'bulbasaur 2',
                },
            ]
        })

		const row = new MessageActionRow({
            components: [ select ]
        });

		await interaction.reply({
			content: 'Choose your starter!',
			components: [ row ],
		});
    }
}