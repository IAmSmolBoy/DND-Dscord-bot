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
            const char = campaign.characters.find(char => char.username.toLowerCase().split(" ").includes(args[0].toLowerCase()))
            if (!char) {
                return channel.send("Character not found in this campaign")
            }

            // Get Character and add to the embed
            addCharToEmbed(char)

            // Get Character and add to the embed
            var charSheet = ""

            if (char.skillChecks) {
                charSheet += "\n---------------------- Skill Checks ----------------------"
                for (const [ check, bonus ] of Object.entries(char.skillChecks)) {
                    charSheet += `\n${check}: ${bonus}`
                }
            }

            if (char.spellSlots.length > 0) {
                charSheet += "\n---------------------- Spell Slots ----------------------"
                char.spellSlots.forEach((slots, i) => {
                    charSheet += `\n${i + 1}`
                    switch(i) {
                        case 0:
                            charSheet += "st"
                            break
                        case 1:
                            charSheet += "nd"
                            break
                        case 2:
                            charSheet += "rd"
                            break
                        default:
                            charSheet += "th"
                            break
                    }
                    charSheet += ` level: ${slots} slots`
                })
            }

            //Send the embed
            channel.send({ embeds: [embed] })
            return channel.send(charSheet)
        }
        else {
            // Loops through campaign characters and adds to the embed
            for (const char of campaign.characters) addCharToEmbed(char)

            //Send the embed
            return channel.send({ embeds: [embed] })
        }
    }
}