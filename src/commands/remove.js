const { sendFormatErr } = require("../util")

module.exports = async function ({ args, channel, format }) {
    // Import character schema
    const Char = require("../models/character")
    sendFormatErr(channel, format)

    if (args.length !== 1) {
        // Command has to have 1 argument(String)
        return channel.send("Invalid arguments. Format: " + format)
    }
    else {
        // Check if the character exists
        const existing = await Char.findOne({ username: args[0] })

        if (!existing) {
            // If character does not exists, remove fails
            return channel.send("Character does already exists")
        }
        else {
            // deletes character from MongoDB
            await Char.deleteOne({ username: args[0] })
            return channel.send(`${args[0]} removed`)
        }
    }
}