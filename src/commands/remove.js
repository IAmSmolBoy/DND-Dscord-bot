const { sendFormatErr, findCampaign } = require("../util")
const { edit } = require("../mongodb")

module.exports = async function ({ args, channel, format, guild }) {
    /*                         Error Handling                         */
    // Command has to have 1 argument(String)
   if (args.length !== 1) return sendFormatErr(channel, format)

    // Get campaign and check if pc is inside campaign
    const campaign = await findCampaign(guild.id)
    if (!campaign.characters.map(char => char.username).includes(args[0])) {
        return channel.send("Character does not exist in this campaign")
    }





    /*                         Removing Character from campaign                         */
    // Check if the character exists
    const character = campaign.characters.find(char => char.username === args[0])

    // deletes character from MongoDB
    await edit("Campaign", { guildId: guild.id }, { $pull: { characters: args[0] } })
    return channel.send(`${args[0]} removed`)
}