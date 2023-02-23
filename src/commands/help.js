const { sendFormatErr } = require("../util")

module.exports = function ({ args, channel, commandList }) {
    /*                         Variable and Function Assignments                         */
    var commandHelpList = ""
    const formatCommandInfo = (name, info) => `${name[0].toUpperCase()}${name.slice(1)}:
        Description: ${info.description}
        Format: ${info.format}\n`





    /*                         Display Command Info                         */
    if (args.length > 0) {
        // Search for a specific command
        // If there are more than 1 argumnts or if the 2nd argument is a number, it will send a wrong format error
        if (args.length > 1) sendFormatErr(channel, commandList.help.format)

        // Format argument command
        const command = args[0].toLowerCase()

        //If command cannot be found, return error
        if (!commandList[command]) return channel.send("Command not found")
        
        // Find command and send information on it
        commandHelpList = formatCommandInfo(command, commandList[command])
    }
    else {
        // Display all commands
        // Loop through all commands to display the description, format
        for (const [ name, info ] of Object.entries(commandList)) {
            commandHelpList += formatCommandInfo(name, info)
        }
    }

    // Sends the list to the channel
    return channel.send(commandHelpList)
}