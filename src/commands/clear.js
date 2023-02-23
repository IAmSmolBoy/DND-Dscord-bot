const { sendFormatErr } = require("../util")

module.exports = function ({ args, channel, format }) {
    if (args.length != 1 || isNaN(args[0])) {
        // Command has to have 1 argument(Number)
        sendFormatErr(channel, format)
    }
    else if (parseInt(args[0]) > 99 || parseInt(args[0]) < 1) {
        // Cannot delete more than 99 messages
        return channel.send("I can only delete between 1 and 99 messages")
    }
    else {
        channel
            .bulkDelete(parseInt(args[0]) + 1)
            .catch(err => {
                // Messages over 14 days old cannot be deleted
                console.log(err)
                return channel.send("Oh god, what is happ_ **explosion**\nU cannot delete messages that are more than 14 days old.")
            })
    }
}