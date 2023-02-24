const { sendFormatErr } = require("../util")
const { get, edit, del } = require("../mongodb")

module.exports = async function ({ args, channel, format, guild }) {
   if (args.length !== 1) {
        // Command has to have 1 argument(String)
        return sendFormatErr(channel, format)
    }
    else {
        // Check if the character exists
        const existing = await get("Char", { username: args[0] })

        if (!existing) {
            // If character does not exists, remove fails
            return channel.send("Character does already exists")
        }
        else {
            // deletes character from MongoDB
            await del("Char", { username: args[0] })
            await edit("Campaign", { guildId: guild.id }, {
                $pull: {
                    characters: args[0]
                }
            })
            return channel.send(`${args[0]} removed`)
        }
    }
}