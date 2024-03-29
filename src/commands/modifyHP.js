const { getBattles, findCampaign, sendFormatErr } = require("../util")
const { edit, get } = require("../mongodb")

module.exports = async function ({ args, format, command, channel, guild }) {
    /*                         Error Handling                         */
    // Command takes 2 arguments(String, Number)
    if (args.length != 2 || isNaN(args[1])) return sendFormatErr(channel, format)
    const [ username, inc ] = args

    // If command is dmg, increment will be negative to decrease hp
    var increment = parseInt(inc)
    if (command === "dmg") increment *= -1

    // Get campaign and check if pc is inside campaign
    const campaign = await findCampaign(guild.id)

    // Get all Battles
    const embedMsgs = await getBattles(channel.messages)

    // Check if character exists inside campaign
    const charIndex = campaign.characters.findIndex(char => char.username.toLowerCase().split(" ").includes(username.toLowerCase()))

    // If battle is ongoing, get battle msg info
    var embed, fields, charFieldIndex

    if (embedMsgs.length > 0) {
        // Get latest battle
        embed = embedMsgs[0][1].embeds[0]
        fields = embed.fields
    
        // Getting index of username
        charFieldIndex = fields.findIndex((entry) => entry.name.slice(entry.name.indexOf(".") + 2).toLowerCase().includes(args[0].toLowerCase()))
    }





    /*                         Getting new HP                         */
    var newHP, maxHP, initiative
    if (charIndex > -1) {
        // Get pc from campaign characters
        const char = campaign.characters[charIndex]
        maxHP = char.maxHP
    
        // If dmg is too high, set currHP to 0. If healing is too high, set currHP to maxHP
        newHP = char.currHP + increment
        if (newHP > char.maxHP) newHP = char.maxHP
        else if (newHP < 0) newHP = 0
    
        setParams = {}
        setParams[`characters.${charIndex}.currHP`] = newHP

        // Update character currHP
        await edit("Campaign", { "guildId": guild.id }, {
            '$set': setParams
        }, { new: true })   
    }
    else if (charFieldIndex > -1) {
        // If entity is an enemy, let DM handle it
        if (!fields[charFieldIndex].value.includes("/")) return channel.send("This is an enemy and the DM will manage that")

        // Getting battle fields
        var [ health, initiative ] = fields[charFieldIndex].value.split("\n")
        var [ currHP, maxHP ] = health.split("/")
    
        // If dmg is too high, set currHP to 0. If healing is too high, set currHP to maxHP
        newHP = parseInt(currHP) + increment
        if (newHP > parseInt(maxHP)) newHP = maxHP
        else if (newHP < 0) newHP = 0
    }
    else {
        return channel.send("Character not found in this campaign")
    }





    /*                         Updating pc stats                         */
    // Check if field exists
    if (embedMsgs.length > 0) {
        // If battle is ongoing get current initiative
        if (charFieldIndex > -1) {
            initiative = fields[charFieldIndex].value.split("\n")[1]
        }

        // Replacing the field with a new set of values for currHP and maxHP
        fields[charFieldIndex].value = `${newHP}/${maxHP}\n${initiative}`
    
        // Reassign fields to embed and edit the battle message
        embed.fields = fields
        const latestBattle = await channel.messages.fetch(embedMsgs[0][1].id)
        return latestBattle.edit({ embeds: [ embed ] })
    }
    else if (charIndex > -1) {
        // If there is no battle ongoing, just send new hp
        return channel.send(`${username}'s HP is now ${newHP}`)
    }
    else {
        return channel.send("Character not found in this campaign")
    }
}
