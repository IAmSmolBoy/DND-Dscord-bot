const { MessageActionRow } = require("discord.js")

module.exports = {
    name: "dmg",
    description: "Damages characters (options can be selected after running the command)",
    onSelect: async interaction => {

    },
    execute: async interaction => {

        

        const menu = new MessageSelectMenu({
            custom_id: "enemyselector",
            placeholder: 'Select unwanted enemies',
            max_values: allEnemies.length,
            options: allChar
                .map(enemy => {
                    return {
                        label: enemy.name,
                        description: `Battle: ${enemy.battle}`,
                        value: JSON.stringify({ name: enemy.name, battle: enemy.battle })
                    }
                })
        })

        await interaction.reply({
			content: 'Select unwanted enemies',
			components: [
                new MessageActionRow({
                    components: [ menu ]
                })
            ],
		})
    }
}