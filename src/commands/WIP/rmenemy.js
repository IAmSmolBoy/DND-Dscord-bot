const { MessageActionRow, MessageSelectMenu } = require('discord.js');

const Battle = require("../../models/battle")

async function getEnemies(guildId) {

    const battles = await Battle.find({ "identifiers.guildID": guildId }).lean()
    const allEnemies = []
    
    for (const battle of battles) {
        for (const enemy of battle.enemies) {
            allEnemies.push({
                ...enemy,
                mod: null,
                battle: battle.identifiers.name
            })
        }
    }

    return {
        battles,
        allEnemies
    }

}

module.exports = {
    name: "rmenemy",
    description: "Removes an enemy from a battle",
    onSelect: async interaction => {

        const { battles } = await getEnemies(interaction.guildId)
        const parsedEnemyData = interaction.values.map(enemyData => JSON.parse(enemyData))
        const selected = {}

        for (const enemy of parsedEnemyData) {
            if (!(enemy.battle in selected)) selected[enemy.battle] = []

            selected[enemy.battle].push(enemy)
        }
        

        for (const battleName in selected) {
            const battle = battles.find(battle => battle.identifiers.name === battleName)

            battle.enemies = battle.enemies
                .filter(
                    enemy =>
                        !selected[battleName]
                            .map(enemyData => enemyData.name)
                            .includes(enemy.name)
                )

            const identifiers = {
                name: battleName,
                guildID: interaction.guildId
            }

            if (battle.enemies.length === 0) {
                await Battle.findOneAndRemove({ identifiers })
            }
            else {
                await Battle.findOneAndUpdate(
                    { identifiers },
                    { enemies: battle.enemies }
                )
            }
        }

        return await interaction.reply(`The enemies ${parsedEnemyData.map(enemyData => enemyData.name).join(", ")} were removed`)
    },
    execute: async interaction => {
        
        const { allEnemies } = await getEnemies(interaction.guildId)

        const menu = new MessageSelectMenu({
            custom_id: "enemyselector",
            placeholder: 'Select unwanted enemies',
            max_values: allEnemies.length,
            options: allEnemies
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
		});
    }
}