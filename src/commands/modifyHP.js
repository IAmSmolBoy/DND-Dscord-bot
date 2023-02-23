const Char = require("../models/character")
const { getBattles } = require("../util")
const { sendFormatErr } = require("../util")

module.exports = async function ({ args, format, command, channel }) {
    /*                         Error Handling                         */
    // Command takes 2 arguments(String, Number)
    if (args.length != 2 || isNaN(args[1])) return sendFormatErr(channel, format)

    // If pc is not found, return not found error
    const char = await Char.findOne({ username: args[0] })
    if (!char) return channel.send("Entity not found")





    /*                         Updating pc stats                         */
    // If command is dmg, increment will be negative to decrease hp
    var increment = parseInt(args[1])
    if (command === "dmg") increment *= -1

    // If dmg is too high, set currHP to 0. If healing is too much, set currHP to maxHP
    var newHP = char.currHP + increment
    if (newHP > char.maxHP) newHP = char.maxHP
    else if (newHP < 0) newHP = 0

    // Update character currHP
    await Char.findOneAndUpdate({ username: args[0] }, { currHP: newHP })

    // Get battle and modify the hp 
    await getBattles(channel.messages, async (embedMsgs) => {
        // If there is no battle ongoing, just send new hp
        if (embedMsgs.length === 0) return channel.send(`${args[0]}'s HP is now ${newHP}`)

        // Get first embed msg
        var embed = embedMsgs[0].embeds[0]
        var fields = embed.fields

        // Replacing the field with a new set of values for currHP and maxHP
        const charFieldIndex = fields.map((e) => e.name).indexOf(char.username)
        fields[charFieldIndex].value = `${newHP}/${char.maxHP}\n${fields[charFieldIndex].value.split("\n")[1]}`

        // Reassign fields to embed and edit the battle message
        embed.fields = fields
        const latestBattle = await channel.messages.fetch(embedMsgs[0].id)
        return latestBattle.edit({ embeds: [ embed ] })
    })
}
