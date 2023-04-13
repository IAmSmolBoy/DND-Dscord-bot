const { sendFormatErr, findCampaign } = require("../util")
const { edit } = require("../mongodb")

module.exports = async function ({ args, channel, format, guild }) {
    /*                         Error Handling                         */
    // Command has to have 1 argument(String)
   if (args.length !== 1) return sendFormatErr(channel, format)

    // Get campaign and check if pc is inside campaign
    const campaign = await findCampaign(guild.id)
    const charIndex = campaign.characters.findIndex(char => char.username.toLowerCase().split(" ").includes(args[0].toLowerCase()))
    if (charIndex === -1) {
        return channel.send("Character does not exist in this campaign")
    }





    /*                         Removing Character from campaign                         */
    // Check if the character exists
    campaign.characters.splice(charIndex, 1)


    // deletes character from MongoDB
    await edit("Campaign", { guildId: guild.id }, { $set: { characters: campaign.characters } })
    return channel.send(`${args[0]} removed`)
}