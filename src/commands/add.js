const { sendFormatErr, findCampaign } = require("../util")
const { newObj, edit } = require("../mongodb")

module.exports = async function ({ args, channel, format, guild }) {
    // Get Campaign
    const campaign = await findCampaign(guild.id)

    if (args.length !== 2 || isNaN(args[1])) {
        // Command has to have 2 arguments(String, Number)
        return sendFormatErr(channel, format)
    }
    else {
        // Check if the character exists
        const existing = campaign.characters.find(char => char.username === args[0])

        if (existing) {
            // If character already exists, add fails
            return channel.send("Character already exists")
        }
        else {
            // Saves character into MongoDB
            const newChar = newObj("Char", {
                username: args[0],
                maxHP: args[1],
                currHP: args[1]
            })
            await edit("Campaign", { guildId: guild.id }, { $push: { characters: newChar } })
            return channel.send(`${args[0]} added`)
        }
    }
}