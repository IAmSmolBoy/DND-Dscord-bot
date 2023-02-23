module.exports = async function ({ args, channel }) {
    if (args.length > 0) return msg.channel.send("Invalid arguments. Format: " + format)
    const allChars = await Char.find()
    async function longRest(msg, args, format) {
        const allChars = await Char.find()
        allChars.forEach(async (e) => {
            await Char.findOneAndUpdate({ username: e.username }, { currHP: e.maxHP })
        })
        return msg.channel.send("The party is rested and has regained all their HP");
    }
}