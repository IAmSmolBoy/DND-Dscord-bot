const { sendFormatErr, findCampaign } = require("../util")

module.exports = async function({ channel, format, args, guild }) {
    /*                         Error Handling                         */
    // Check if command does not have more than 1 argument
    if (args.length > 1) return sendFormatErr(channel, format)

    // Find campaign and check if battle exists
    const campaign = await findCampaign(guild.id)
    var battles
    if (campaign.battles.length === 0) return channel.send("No battles prepared")
    if (args.length === 1) {
        if (!campaign.battles.map(battle => battle.name).includes(args[0])) {
            return channel.send("Battle does not exist in this campaign")
        }
        else battles = [campaign.battles.find(battle => battle.name === args[0])]
    }
    else battles = campaign.battles





    /*                         Displaying battle                         */
    // Loop through battles to display each battle
    var battleViewList = "=".repeat(20)  + "\tBattle Instances\t" + "=".repeat(20)
    for (const battle of battles) {
        battleViewList += `\n${battle.name} battle:\n\tEnemies:`
        for (const enemy of battle.enemies) {
            battleViewList += `\n\t\t${enemy.monster}:\n\t\t\tInitiative Mod: ${enemy.initMod}`
        }
    }
    channel.send(battleViewList)
}