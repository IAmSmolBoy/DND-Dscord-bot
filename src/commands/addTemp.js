async function addTemp(msg, args, format) {
    //Checking syntax and command args
    argCheckerList = [
        args.length < 4,
        args.length > 5,
        [1, 2, 3].some(i => isNaN(args[i]))
    ]
    if (argCheckerList.some(e => e)) return msg.channel.send(`Wrong format. ${format}`)

    //Getting all required fields
    var [ name, hp, initiative, quantity ] = args.map((arg, i) => i !== 0 ? parseInt(arg) : arg)
    if (args.length === 5) name = `${args[4]}'s ${name}`

    //Searching msgs for battle embed
    var prevMsgs = await msg.channel.messages.fetch(), options = { limit: 100 }, embedMsgs;
    for (i = 0; i < 3; i++) {
        embedMsgs = prevMsgs.filter(e => e.embeds[0] ? e.embeds[0].title === "Initiative" : false)
        if (embedMsgs.size !== 0) break
        options.before = prevMsgs.last().id
        prevMsgs = await msg.channel.messages.fetch(options)
    }
    if (embedMsgs.size === 0) return msg.channel.send("The land looks barren, no enemies in sight. Either that, or your battle has been going on forever. Its too far back")

    //Updating the embed fields
    const latestBattle = [...embedMsgs][0][1]
    var fields = latestBattle.embeds[0].fields
    for (var i = 0; i < quantity; i++) {
        fields.push({
            name:  `${name} ${i + 1}`,
            value: `${hp}/${hp}\n    Initative: ${(Math.random() * 19 + initiative + 1).toFixed(0)}`,
            inline: false
        })
    }
    getInit = (val) => parseInt(val.value.slice(val.value.length - 2))
    latestBattle.embeds[0].fields = fields.sort((first, second) => getInit(second) - getInit(first))
    const newEmbedList = latestBattle.embeds

    embedMsgs.get(latestBattle.id).edit({ embeds: newEmbedList })
}

module.exports = { addTemp }