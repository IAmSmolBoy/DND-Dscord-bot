const { sendFormatErr } = require("../util")

module.exports = function ({ args, channel, format }) {
    // Check number of arguments
    if (args.length > 2 || args.length < 1) return sendFormatErr(channel, format)
    else {
        // Get dice and proficiency(if any)
        var [ dice, proficiency ] = args

        // Dice capitalisation
        dice = dice.toLowerCase()

        // Checks dice format
        if (!dice.includes("d") || dice.split("d")[1] === "") return sendFormatErr(channel, format)

        // Gets number of dice and sides then converts it to integer. If no. of dice is empty, no. of dice defaults to 1
        var [ noOfDice, sides ] = dice.split("d")
        if (noOfDice === "") noOfDice = 1

        // Totals up the rolls and adds the roll to a list to display
        var ranNumList = [], totalRoll = 0
        for (i = 0 ; i < noOfDice; i++) {
            var ranNum = Math.round(Math.random() * parseInt(sides - 1) + 1)
            ranNumList.push(`(${ranNum})`)
            totalRoll += ranNum
        }

        // If proficiency is provided, add it to the rolls and the display list
        if (proficiency) {
            totalRoll += parseInt(proficiency)
            ranNumList.push(proficiency)
        }

        // Send the rolls and return the number for other functions to use
        channel.send(`${ranNumList.join(" + ")} = ${totalRoll}`)
        return totalRoll
    }
}