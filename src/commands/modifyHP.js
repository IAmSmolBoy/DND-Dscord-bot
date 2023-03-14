const { getBattles, findCampaign, sendFormatErr } = require("../util")
const { edit } = require("../mongodb")

module.exports = async function ({ args, format, command, channel, guild }) {
    /*                         Error Handling                         */
    // Command takes 2 arguments(String, Number)
    if (args.length != 2 || isNaN(args[1])) return sendFormatErr(channel, format)
    const [ username, inc ] = args

    // Get campaign and check if pc is inside campaign
    const campaign = await findCampaign(guild.id)

    // Get all Battles
    const embedMsgs = await getBattles(channel.messages)

    // If there is no battle ongoing, just send new hp
    if (embedMsgs.length === 0) return channel.send(`${username}'s HP is now ${newHP}`)
    
    // Check if character exists inside campaign
    var charInCampaign = campaign.characters.map(char => char.username).includes(username.slice(username.indexOf(".") + 2))

    // Get latest battle
    var embed = embedMsgs[0][1].embeds[0]
    var fields = embed.fields

    // Getting index of username
    const charFieldIndex = fields.map((e) => e.name.slice(e.name.indexOf(".") + 2)).indexOf(args[0])

    // If command is dmg, increment will be negative to decrease hp
    var increment = parseInt(inc)
    if (command === "dmg") increment *= -1





    /*                         Updating pc stats                         */
    
    if (charInCampaign) {
        // Get pc from campaign characters
        const char = campaign.characters.find(char => char.username === username)
    
        // If dmg is too high, set currHP to 0. If healing is too high, set currHP to maxHP
        var newHP = char.currHP + increment
        if (newHP > char.maxHP) newHP = char.maxHP
        else if (newHP < 0) newHP = 0
    
        // Update character currHP
        await edit("Campaign", { "characters.username": username }, {
            '$set': {
                "characters.$.currHP": newHP
            }
        }, { new: true })
    }

    // Check if field exists
    if (charFieldIndex > -1) {
        // If entity is an enemy, let DM handle it
        if (!fields[charFieldIndex].value.includes("/")) return channel.send("This is an enemy and the DM will manage that")

        // Getting battle fields
        const [ health, initiative ] = fields[charFieldIndex].value.split("\n")
        const [ currHP, maxHP ] = health.split("/")
    
        // If dmg is too high, set currHP to 0. If healing is too high, set currHP to maxHP
        var newHP = parseInt(currHP) + increment
        if (newHP > parseInt(maxHP)) newHP = maxHP
        else if (newHP < 0) newHP = 0

        // Replacing the field with a new set of values for currHP and maxHP
        fields[charFieldIndex].value = `${newHP}/${maxHP}\n${initiative}`
    
        // Reassign fields to embed and edit the battle message
        embed.fields = fields
        const latestBattle = await channel.messages.fetch(embedMsgs[0][1].id)
        return latestBattle.edit({ embeds: [ embed ] })
    }
    else if (charInCampaign) {
        return channel.send(`${username}'s HP is now ${newHP}`)
    }
    else {
        return channel.send("Character not found in this campaign")
    }
}
