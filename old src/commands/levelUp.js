const { edit } = require("../mongodb")
const { sendFormatErr, findCampaign } = require("../util")

module.exports = async function({ channel, format, args, guild }) {
    /*                         Error Handling                         */
    // Check arguments
    if (args.length !== 2 || isNaN(args[1])) return sendFormatErr(channel, format)

    // Get campaign and check if pc is inside campaign
    const campaign = await findCampaign(guild.id)
    if (!campaign.characters.map(char => char.username).includes(args[0])) {
        return channel.send("Character not found in this campaign")
    }





    /*                         Adding health to pc                         */
    // Get pc
    const char = campaign.characters.find(character => character.username === args[0])
    const newCampaign = await edit("Campaign", { "characters.username": args[0] }, {
        '$set': {
            "characters.$.maxHP": char.maxHP + parseInt(args[1])
        }
    }, { new: true })
    const newChar = newCampaign.characters.find(character => character.username === args[0])
    return channel.send(`${newChar.username}'s max hp is now ${newChar.maxHP}`)
}