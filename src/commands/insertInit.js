const { sendFormatErr, getBattles, findCampaign } = require("../util")

module.exports = async function({ args, channel, format, guild }) {
    /*                         Error Handling                         */
    // Check arguments
    if (args.length !== 2 || isNaN(args[1])) return sendFormatErr(channel, format)

    // Checks for recent battles
    const battles = await getBattles(channel.messages)
    if (battles.length === 0) return channel.send("The land looks barren, no enemies in sight.")

    // Get campaign and check if pc is inside campaign
    const campaign = await findCampaign(guild.id)
    if (!campaign.characters.map(char => char.username).includes(args[0])) {
        return channel.send("Character not found in this campaign")
    }





    /*                         Adding character to initiative                         */
    // Get the latest battle
    const latestBattle = battles[0]
    var fields = latestBattle.embeds[0].fields

    // Get character sheet
    const char = campaign.characters.find(char => char.username === args[0])
    if (!char) return channel.send("Character not found")
    else if (fields.map(e => e.name).includes(args[0])) {
        // If user is already in the battle, delete user from battle
        for (i in fields) if (fields[i].name === args[0]) fields.splice(i, 1)
    }

    // Get all initiative rolls into a list and add new initiative roll, then sort it by descending order
    fields.push({
        name: args[0],
        value: `${char.currHP}/${char.maxHP}\nInitiative: ${args[1]}`,
        inline: false
    })
    
    // This function extracts the initiative from the fields and converts it to integer
    const getInit = (val) => parseInt(val.value.slice(val.value.length - 2))

    // The function is then used to sort the fields
    latestBattle.embeds[0].fields = fields.sort((first, second) => getInit(second) - getInit(first))

    // Add all fields into the embed and edit the battle message to add the new embed
    const newEmbedList = latestBattle.embeds
    console.log(newEmbedList)
    const battleMsg = await channel.messages.fetch(latestBattle.id)
    battleMsg.edit({ embeds: newEmbedList })
}