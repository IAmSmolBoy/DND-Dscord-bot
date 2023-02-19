module.exports = function ({ msg, args, commands }) {
    // var helpMenu = []
    // if (isNaN(pageNo)) {
    //     if (!(pageNo in commandDict)) return msg.channel.send("Command not found")
    //     else {
    //         return msg.channel.send(`${pageNo[0].toUpperCase() + pageNo.slice(1) + ":"}
    //         \tDescription: ${commandDict[pageNo].description}
    //         \tFormat: ${commandDict[pageNo].format}`)
    //     }
    // }
    // if (pageNo !== 1) pageNo = parseInt(pageNo)
    // Object.entries(commandDict).forEach(([key, value], i) => {
    //     if (i >= 6 * (pageNo - 1) && i < 6 * pageNo) {
    //         helpMenu.push(key[0].toUpperCase() + key.slice(1) + ":")
    //         helpMenu.push(`\tDescription: ${value["description"]}`)
    //         helpMenu.push(`\tFormat: ${value["format"]}\n`)
    //     }
    // });
    // var helpText = helpMenu.join("\n")
    // if (pageNo * 6 < Object.keys(commandDict).length) helpText += `\nUse $help ${pageNo + 1} for the next page`
    // return msg.channel.send(`**Command Guide**\n` + helpText)

    /*                         Error Handling                         */
    if (args.length > 1) return msg.channel.send(`Wrong format. Use ${commands}`)





    /*                         Error Handling                         */
    const commandHelpList = Object.entries(commands).map(([ name, details ]) => )
    
}