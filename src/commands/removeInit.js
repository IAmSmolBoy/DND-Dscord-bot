const { sendFormatErr, getBattles } = require("../util")

module.exports = async function({ channel, format, args, guild }) {
    /*                         Error Handling                         */
    // Check args length and check that initiative index is a number
    if (args.length !== 1 || isNaN(args[0])) return sendFormatErr(channel, format)

    // Finding latest Battle
    const battles = await getBattles(channel.messages)
    if (battles.length === 0) return channel.send("The land looks barren, no enemies in sight.")
    const latestBattle = battles[0]
    var fields = latestBattle.embeds[0].fields
    
    // Checking if the index provided is inside the fields
    if (index > fields.length) return channel.send("Initiative index not found")





    /*                         Removing initiative from battle                         */
    // Deleting from initiative list and editing the battle msg
    fields.splice(index - 1, 1)
    latestBattle.embeds[0].fields = fields 
    channel.messages.get(latestBattle.id).edit({ embeds: latestBattle.embeds })
}