const { get, save } = require("./mongodb")

async function getBattles(msgs) {
    // Initialising variables
    var options = { limit: 100 }, lastMsgs;
    var embedMsgs = []

    for (i = 0; i < 3; i++) {
        // If lastMsgs exists, add a before attribute to fetch options to start message search from there
        if (lastMsgs) options.before = lastMsgs.last().id

        // Fetch msgs
        lastMsgs = await msgs.fetch(options)

        // Filter msgs to get all battles and add to embedMsgs
        embedMsgs = [...embedMsgs, ...lastMsgs.filter((e) => e.embeds[0] && e.embeds[0].title === "Initiative")]
    }

    return embedMsgs
}

const sendFormatErr = (channel, format) => channel.send(`Invalid arguments. Format: ${format}`)

async function findCampaign(guildId) {
    // Find campaign by guildId
    var campaign = await get("Campaign", { guildId })

    // If campaign does not exists, create new campaign
    if (!campaign) {
        campaign = await save("Campaign", {
            guildId: guild.id,
            characters: [],
            battles: []
        })
    }
    
    return campaign
}

module.exports = {
    getBattles,
    sendFormatErr,
    findCampaign
}