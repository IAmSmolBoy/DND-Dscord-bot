const { findCampaign, sendFormatErr, getBattles } = require("../util")
const { edit } = require("../mongodb")
const { Collection } = require("discord.js")

module.exports = async function({ channel, format, args, guild }) {
    /*                         Error Handling                         */
    // Check if command does not have more than 1 argument
    if (args.length > 1) return sendFormatErr(channel, format)

    // Find campaign and check if battle exists
    const campaign = await findCampaign(guild.id)
    var battleIndex
    if (campaign.battles.length === 0) battleIndex = -1
    if (args.length === 1) {
        if (!campaign.battles.map(battle => battle.name).includes(args[0])) {
            return channel.send("Battle does not exist in this campaign")
        }
        else battleIndex = campaign.battles.findIndex(battle => battle.name === args[0])
    }
    else battleIndex = 0





    /*                         Displaying battle                         */
    // Get all battles and delete them
    const battleMsgs = await getBattles(channel.messages)
    await channel.bulkDelete(new Collection(battleMsgs))

    // Check if there are any battles
    if (battleIndex < 0) return channel.send("No battles prepared")

    // deletes selected battle instance
    const battle = campaign.battles[battleIndex].name
    campaign.battles.splice(battleIndex, 1)
    edit("Campaign", { guildId: guild.id }, {
        "$set": {
            battles: campaign.battles
        }
    })
    return channel.send(battle + " battle has been removed")
}