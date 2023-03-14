const { sendFormatErr, getBattles } = require("../util")
const roll = require("./roll")

module.exports = async function({ channel, format, args }) {
    /*                         Error Handling                         */
    // Check args length and check that quantity and initiative is a number
    if (args.length < 3 || args.length > 4 || isNaN(args[1]) || isNaN(args[2])) return sendFormatErr(channel, format)
    const [ name, health, initiative ] = args

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
    if (noOfSummons === 1) {
        fields.push({
            name:  "1. " + name,
            value: `${health}/${health}\nInitative: ${initiative}`,
            inline: false
        })
    }
    else {
        for (var i = 0; i < noOfSummons; i++) {
            fields.push({
                name:  `1. ${name}${i + 1}`,
                value: `${health}/${health}\nInitative: ${initiative}`,
                inline: false
            })
        }
    }
    
    // This function extracts the initiative from the fields and converts it to integer
    const getInit = (val) => parseInt(val.value.slice(val.value.indexOf(":") + 2))
    
    // The getInit function is used to sort the fields
    latestBattle.embeds[0].fields = fields.sort((first, second) => getInit(second) - getInit(first))
    
    // Update initiative indexes
    latestBattle.embeds[0].fields = fields.map((field, i) => {
        field.name = `${i + 1}. ${field.name.slice(field.name.indexOf(".") + 2)}`
        return field
    })

    const latestBattleMsg = await channel.messages.fetch(latestBattle.id)
    latestBattleMsg.edit({ embeds: latestBattle.embeds })
}