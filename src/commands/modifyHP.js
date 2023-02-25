const { getBattles, findCampaign, sendFormatErr } = require("../util")
const { edit } = require("../mongodb")

module.exports = async function ({ args, format, command, channel, guild }) {
    /*                         Error Handling                         */
    // Command takes 2 arguments(String, Number)
    if (args.length != 2 || isNaN(args[1])) return sendFormatErr(channel, format)

    // Get campaign and check if pc is inside campaign
    const campaign = await findCampaign(guild.id)
    if (!campaign.characters.map(char => char.username).includes(args[0])) {
        return channel.send("Character not found in this campaign")
    }





    /*                         Updating pc stats                         */
    // Get pc from campaign characters
    const char = campaign.characters.find(char => char.username === args[0])

    // If command is dmg, increment will be negative to decrease hp
    var increment = parseInt(args[1])
    if (command === "dmg") increment *= -1

    // If dmg is too high, set currHP to 0. If healing is too high, set currHP to maxHP
    var newHP = char.currHP + increment
    if (newHP > char.maxHP) newHP = char.maxHP
    else if (newHP < 0) newHP = 0

    // Update character currHP
    await edit("Campaign", { "characters.username": args[0] }, {
        '$set': {
            "characters.$.currHP": newHP
        }
    }, { new: true })

    // Get all Battles
    const embedMsgs = await getBattles(channel.messages)

    // If there is no battle ongoing, just send new hp
    if (embedMsgs.length === 0) return channel.send(`${args[0]}'s HP is now ${newHP}`)

    // Get latest battle
    var embed = embedMsgs[0].embeds[0]
    var fields = embed.fields

    // Replacing the field with a new set of values for currHP and maxHP
    const charFieldIndex = fields.map((e) => e.name).indexOf(char.username)
    fields[charFieldIndex].value = `${newHP}/${char.maxHP}\n${fields[charFieldIndex].value.split("\n")[1]}`

    // Reassign fields to embed and edit the battle message
    embed.fields = fields
    const latestBattle = await channel.messages.fetch(embedMsgs[0].id)
    return latestBattle.edit({ embeds: [ embed ] })
}
