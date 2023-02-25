const { findCampaign } = require("../util")
const { edit } = require("../mongodb")

module.exports = async function ({ channel, guild }) {
    const campaign = await findCampaign(guild.id)
    for (const char of campaign.characters) {
        // Get characters from campaign and set currHP to maxHP
        await edit("Campaign", { "characters.username": char.username }, {
            '$set': {
                "characters.$.currHP": char.maxHP
            }
        })
    }
    return channel.send("The party is rested and has regained all their HP");
}