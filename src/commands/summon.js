const { sendFormatErr, getBattles } = require("../util")
const roll = require("./roll")

module.exports = async function({ channel, format, args }) {
    /*                         Error Handling                         */
    // Check args length and check that quantity and initiative is a number
    if (args.length < 3 || args.length > 4 || isNaN(args[1]) || isNaN(args[2])) return sendFormatErr(channel, format)

    // If unspecified, the number of entities spawned will be 1
    var noOfSummons = 1
    if (args.length === 4) {
        if (isNaN(args[3])) return sendFormatErr(channel, format)
        noOfSummons = parseInt(args[3])
    }

    // Finding latest Battle
    const battles = await getBattles(channel.messages)
    if (battles.length === 0) return channel.send("The land looks barren, no enemies in sight.")
    const latestBattle = battles[0][1]
    var fields = latestBattle.embeds[0].fields





    /*                         Summoning entity into battle                         */
    for (var i = 0; i < noOfSummons; i++) {
        fields.push({
            name:  `${args[0]}${i + 1}`,
            value: `${args[2]}/${args[2]}\n    Initative: ${roll({ args: ["d20", args[1]], channel, format: "" })}`,
            inline: false
        })
    }
    
    // This function extracts the initiative from the fields and converts it to integer
    const getInit = (val) => parseInt(val.value.slice(val.value.length - 2))
    
    // The getInit function is used to sort the fields
    latestBattle.embeds[0].fields = fields.sort((first, second) => getInit(second) - getInit(first))
    const latestBattleMsg = await channel.messages.fetch(latestBattle.id)
    latestBattleMsg.edit({ embeds: latestBattle.embeds })
}