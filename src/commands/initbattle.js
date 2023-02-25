const { sendFormatErr, findCampaign } = require("../util")
const { MessageEmbed } = require("discord.js")
const roll = require("./roll")

module.exports = async function({ channel, format, args, guild }) {
    /*                         Error Handling                         */
    // Check if command does not have more than 1 argument
    if (args.length > 1) return sendFormatErr(channel, format)

    // Find campaign and check if battle referenced exists
    const campaign = await findCampaign(guild.id)
    var battle
    if (campaign.battles.length === 0) return channel.send("No battles prepared")
    else{
        if (args.length === 1) {
            if (!campaign.battles.map(battle => battle.name).includes(args[0])) {
                return channel.send("Battle does not exist in this campaign")
            }
            else battle = campaign.battles.find(battle => battle.name === args[0])
        }
        else battle = campaign.battles[0]
    } 

    // Check if there are enemies inside the battle
    const enemies = battle.enemies
    if (enemies.length === 0) return msg.channel.send("No enemies to be seen")





    /*                         Commencing battle                         */
    // Display each enemy
    const enemyNameText = `Enemies: ${enemies.map(({monster}) => monster).join(", ")}`

    // Make the embed and initiatives object
    var initiatives = {}
    var battleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle("Initiative")

    // Rolls initiative for each enemy
    for (const enemy of enemies) {
        var d20 = -99
        while (d20 === -99 || d20 in initiatives) d20 = roll({
            args: [`d20`, `${enemy.initMod}`],
            channel,
            format
        })
        initiatives[d20] = enemy
    }

    // Get rolls and sort them by descending order
    var rolls = Object.keys(initiatives).sort((first, second) => second - first)

    // Add each enemy based on the initiative order
    for (const roll of rolls) {
        battleEmbed.addField(initiatives[roll].monster, `Initiative: ${roll}`)
    }
    channel.send(enemyNameText)
    return channel.send({ embeds: [battleEmbed] })
}