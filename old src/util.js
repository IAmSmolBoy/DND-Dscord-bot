const { get, save } = require("./mongodb")

async function getBattles(msgs) {
    // Initialising variables
    var options = { limit: 100 }, lastMsgs;
    var embedMsgs = []

    for (i = 0; i < 3; i++) {
        // If lastMsgs exists, add a before attribute to fetch options to start message search from there
        if (lastMsgs && lastMsgs.size) {
            options.before = lastMsgs.last().id
        }

        // Fetch msgs
        lastMsgs = await msgs.fetch(options)

        // Filter msgs to get all battles and add to embedMsgs
        embedMsgs = [...embedMsgs, ...lastMsgs.filter((msg) => msg.embeds[0] && msg.embeds[0].title === "Initiative")]
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
            guildId,
            characters: [],
            battles: []
        })
    }
    
    return campaign
}

function getHTMLTextContent(element, html) {
    const closeTag = `</${html.slice(1).split(" ")[0]}>`
    
    return element.split(html)[1].split(closeTag)[0]
}

module.exports = {
    getBattles,
    sendFormatErr,
    findCampaign,
    getHTMLTextContent
}