const { findCampaign, sendFormatErr } = require("../util")
const { newObj, edit } = require("../mongodb")

module.exports = async function({ channel, format, args, guild }) {
    /*                         Error Handling                         */
    // Check if command has only 1 argument
    if (args.length !== 1) return sendFormatErr(channel, format)

    // Find campaign
    const campaign = await findCampaign(guild.id)
    if (campaign.battles.map(battle => battle.name).includes(args[0])) {
        return channel.send("Battle already exists in this campaign")
    }





    /*                         Adding battle                         */
    const battle = newObj("Battle", {
        name: args[0],
        enemies: []
    })

    await edit("Campaign", { guildId: guild.id }, { $push: { battles: battle } })
    return channel.send(`${args[0]} battle added`)
}