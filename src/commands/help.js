const { sendFormatErr } = require("../util")

module.exports = function ({ args, channel, commandList, admin }) {
    /*                         Variable and Function Assignments                         */
    var commandHelpList = "=".repeat(20)  + "\tGuide To DnD Bot\t" + "=".repeat(20) + "\n"
    const formatCommandInfo = (name, info) => `${name[0].toUpperCase()}${name.slice(1)}:
        Description: ${info.description}
        Format: ${info.format}\n`





    /*                         Display Command Info                         */
    if (args.length > 0) {
        // Search for a specific command
        // Format argument command
        const command = args[0].toLowerCase()

        //If command cannot be found, return error
        if (!commandList[command]) return channel.send("Command not found")

        if (commandList[command].admin && !admin) return channel.send("This is forbidden territory. You need to be a DM to view this")
        
        // Find command and send information on it
        commandHelpList = formatCommandInfo(command, commandList[command])
    }
    else {
        // Display all commands
        // Loop through all commands to display the description and format
        commandsDisplayed = 0
        for (const [ name, info ] of Object.entries(commandList)) {
            if (++commandsDisplayed > 16) {
                channel.send(commandHelpList)
                commandHelpList = ""
                commandsDisplayed = 0
            }
            if (info.admin && admin || !info.admin) commandHelpList += formatCommandInfo(name, info)
        }
    }

    // Sends the list to the channel
    if (commandHelpList !== "") return channel.send(commandHelpList)
}