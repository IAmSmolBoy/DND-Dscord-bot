module.exports = {
    removeInit: async (msg, args, format) => {
        //Arg checker and getting index
        const argCheckerList = [
            args.length !== 1,
            isNaN(args[0]),
            parseInt(args[0]) < 1,
        ]
        if (argCheckerList.some(e => e)) return msg.channel.send(`Wrong format. ${format}`)
        var index = parseInt(args[0])

        //Searching msgs for battle embed
        var prevMsgs = await msg.channel.messages.fetch(), options = { limit: 100 }, embedMsgs;
        for (i = 0; i < 3; i++) {
            embedMsgs = prevMsgs.filter(e => e.embeds[0] ? e.embeds[0].title === "Initiative" : false)
            if (embedMsgs.size !== 0) break
            options.before = prevMsgs.last().id
            prevMsgs = await msg.channel.messages.fetch(options)
        }
        if (embedMsgs.size === 0) return msg.channel.send("The land looks barren, no enemies in sight. Either that, or your battle has been going on forever. Its too far back")
        const latestBattle = [...embedMsgs][0][1]
        var fields = latestBattle.embeds[0].fields
        if (index > fields.length) return msg.channel.send(`Wrong format. ${format}`)

        //deleting from initiative list and putting it back
        fields.splice(index - 1, 1)
        latestBattle.embeds[0].fields = fields
        embedMsgs.get(latestBattle.id).edit({ embeds: latestBattle.embeds })
    }
}