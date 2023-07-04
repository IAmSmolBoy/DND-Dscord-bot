const { findCampaign } = require("../util")
const { edit } = require("../mongodb")

module.exports = async function ({ channel, guild }) {
    const campaign = await findCampaign(guild.id)
    const characters = campaign.characters

    for (const charIndex in characters) {
        const query = {
            '$set': {}
        }

        query["$set"][`characters.${charIndex}.currHP`] = characters[charIndex].maxHP

        // Get characters from campaign and set currHP to maxHP
        await edit("Campaign", { "guildId": guild.id }, query)
    }
    return channel.send("The party is rested and has regained all their HP");
}