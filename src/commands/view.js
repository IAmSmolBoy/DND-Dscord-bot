const { findCampaign, sendFormatErr } = require("../util")
const { MessageEmbed } = require("discord.js")

module.exports = async function({ channel, format, args, guild }) {
    // Check arguments
    if (args.length > 1) return sendFormatErr(channel, format)
    else {
        // Get campaign and check if pc is inside campaign
        const campaign = await findCampaign(guild.id)
        const embed = new MessageEmbed()
            .setColor('#00FF00')
            .setTitle("Characters")

        // This function adds a character to the embed
        function addCharToEmbed(char) {
            embed.addFields([
                {
                    name: char.username,
                    value: `${char.currHP}/${char.maxHP}`,
                    inline: false
                }
            ])
        }

        // If argument is provided, search for character by username
        if (args.length === 1) {
            if (!campaign.characters.map(char => char.username).includes(args[0])) {
                return channel.send("Character not found in this campaign")
            }

            // Get Character and add to the embed
            const char = campaign.characters.find(character => character.username === args[0])
            addCharToEmbed(char)
        }
        else {
            // Loops through campaign characters and adds to the embed
            for (const char of campaign.characters) addCharToEmbed(char)
        }

        //Send the embed
        return channel.send({ embeds: [embed] })
    }
}