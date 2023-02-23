async function getBattles(msgs, cb) {
    // Initialising variables
    var options = { limit: 100 }, lastMsgs;
    var embedMsgs = []

    for (i = 0; i < 3; i++) {
        // If lastMsgs exists, add a before attribute to fetch options to start message search from there
        if (lastMsgs) options.before = lastMsgs.last().id

        // Fetch msgs
        lastMsgs = await msgs.fetch(options)

        // Filter msgs to get all battles and add to embedMsgs
        embedMsgs.push.apply(
            embedMsgs,
            lastMsgs.filter((e) => e.embeds[0] && e.embeds[0].title === "Initiative")
        )
    }

    // Call callback after getting battles
    await cb(embedMsgs)
}

async function sendFormatErr(channel, format) {
    return channel.send(`Invalid arguments. Format: ${format}`)
}

module.exports = {
    getBattles,
    sendFormatErr
}