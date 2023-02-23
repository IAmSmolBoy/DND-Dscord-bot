const { sendFormatErr } = require("../util")

module.exports = async function ({ args, channel, format }) {
    // Import character schema
    const Char = require("../models/character")

    if (args.length !== 2 || isNaN(args[1])) {
        // Command has to have 2 arguments(String, Number)
        sendFormatErr(channel, format)
    }
    else {
        // Check if the character exists
        const existing = await Char.findOne({ username: args[0] })

        if (existing) {
            // If character already exists, add fails
            return channel.send("Character already exists")
        }
        else {
            // Saves character into MongoDB
            const character = new Char({
                username: args[0],
                maxHP: args[1],
                currHP: args[1]
            })
            await character.save()
            return channel.send(`${args[0]} added`)
        }
    }
}