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
    
    // This function extracts the initiative from the fields and converts it to integer
    const getInit = (val) => parseInt(val.value.slice(val.value.indexOf(":") + 2))

    // The function is then used to sort the fields
    latestBattle.embeds[0].fields = latestBattle.embeds[0].fields.sort((first, second) => getInit(second) - getInit(first))

    // Update the indexes
    latestBattle.embeds[0].fields = latestBattle.embeds[0].fields.map((entry, i) => {
        entry.name = `${i + 1}. ${entry.name.slice(entry.name.indexOf(".") + 2)}`
        return entry
    })

    // Update the battle message
    const latestBattleMsg = await channel.messages.fetch(latestBattle.id)
    return latestBattleMsg.edit({ embeds: latestBattle.embeds })
}