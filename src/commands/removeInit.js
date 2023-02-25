const { sendFormatErr, getBattles } = require("../util")

module.exports = async function({ channel, format, args, guild }) {
    /*                         Error Handling                         */
    // Check args length and check that initiative index is a number
    if (args.length !== 1 || isNaN(args[0])) return sendFormatErr(channel, format)

    // Finding latest Battle
    const battles = await getBattles(channel.messages)
    if (battles.length === 0) return channel.send("The land looks barren, no enemies in sight.")
    const latestBattle = battles[0][1]
    
    // Checking if the index provided is inside the fields
    if (parseInt(args[0]) > latestBattle.embeds[0].fields.length) return channel.send("Initiative index not found")





    /*                         Removing initiative from battle                         */
    // Deleting from initiative list and editing the battle msg
    latestBattle.embeds[0].fields.splice(parseInt(args[0]) - 1, 1)
    const latestBattleMsg = await channel.messages.fetch(latestBattle.id)
    return latestBattleMsg.edit({ embeds: latestBattle.embeds })
}