const { sendFormatErr, findCampaign } = require("../util")
const { edit, newObj } = require("../mongodb")

module.exports = async function({ channel, format, args, guild }) {
    /*                         Error Handling                         */
    // Check if there are 3 - 4 arguments(String, String, Number, Number)
    if (args.length < 3 || args.length > 4 || isNaN(args[2])) return sendFormatErr(channel, format)

    // If last parameter is not provided, No. of enemies will default to 1
    noOfEnemies = 1
    if (args.length === 4) {
        if (isNaN(args[3])) return sendFormatErr(channel, format)
        noOfEnemies = parseInt(args[3])
    }

    // Find campaign and check if battle exists
    const campaign = await findCampaign(guild.id)
    if (!campaign.battles.map(battle => battle.name).includes(args[0])) {
        const battle = newObj("Battle", {
            name: args[0],
            enemies: []
        })
    
        await edit("Campaign", { guildId: guild.id }, { $push: { battles: battle } })
        campaign.battles.push(battle)
    }





    /*                         Adding enemies into battle                         */
    // Get index of battle then add the enemies into the battle
    const battleIndex = campaign.battles.findIndex(battle => battle.name === args[0])
    for (var i = 0; i < noOfEnemies; i++) {
        campaign.battles[battleIndex].enemies.push(newObj("Enemy", {
            monster: args[1] + `${i + 1}`,
            initMod: parseInt(args[2])
        }))
    }

    // Edit Campaign to include the new enemies
    await edit("Campaign", { guildId: guild.id }, {
        "$set": { battles: campaign.battles }
    })
    return channel.send(`${args[3]} ${args[1]}s added to ${args[0]}`)
}