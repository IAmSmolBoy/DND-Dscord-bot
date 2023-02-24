const { sendFormatErr, findCampaign } = require("../util")
const { get, save, edit } = require("../mongodb")

module.exports = async function ({ args, channel, format, guild }) {
    // Get Campaign
    await findCampaign(guild.id)

    if (args.length !== 2 || isNaN(args[1])) {
        // Command has to have 2 arguments(String, Number)
        return sendFormatErr(channel, format)
    }
    else {
        // Check if the character exists
        const existing = await get("Char", { username: args[0] })

        if (existing) {
            // If character already exists, add fails
            return channel.send("Character already exists")
        }
        else {
            // Saves character into MongoDB
            save("Char", {
                username: args[0],
                maxHP: args[1],
                currHP: args[1]
            })
            edit("Campaign", { guildId: guild.id }, { $push: { characters: args[0] } })
            return channel.send(`${args[0]} added`)
        }
    }
}