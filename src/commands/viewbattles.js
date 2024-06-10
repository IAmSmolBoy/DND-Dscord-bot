const { MessageEmbed } = require("discord.js")
const Battle = require("../models/battle")

module.exports = {
    name: "viewbattles",
    description: "View all battles in this server",
    execute: async (interaction) => {

        const embeds = (await Battle.find({ "identifiers.guildID": interaction.guildId }).lean())
            .map(battle => {
                return new MessageEmbed({
                    title: battle.identifiers.name,
                    color: "#e84f64",
                    fields: [
                        ...battle.enemies
                            .map(enemy => {
                                return {
                                    name: enemy.name,
                                    value: `Initiative Mod: +${enemy.mod}`,
                                    inline: true
                                }
                            })
                    ]
                })
            })

        await interaction.reply(
            embeds.length > 0 ?
                { embeds } :
                "Wow, such empty. There are no battles"
        )
    }
}