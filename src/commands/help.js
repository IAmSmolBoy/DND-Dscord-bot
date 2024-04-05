const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "help",
    description: "Helps you",
    options: [
        {
            type: 3,
            name: "command",
            description: "The command you want to know about",
            autocomplete: true,
        }
    ],
    autocomplete: (interaction, commands) => {
        interaction.respond(
            Object.keys(commands)
                .map(command => {
                    return {
                        name: command,
                        value: command
                    }
                })
        )
    },
    execute: async (interaction, commands) => {

        console.log(interaction.commandName)

        if (commands && commands.length > 0) {

            var embedOptions = {
                title: "COMMANDS",
                color: "#e84f64",
                description: "This is the entire list of commands available to you",
                fields: []
            }
    
            const options = interaction.options._hoistedOptions
            
            if (options.length > 0) {
    
                const commandName = options[0].value
    
                if (commandName in commands) {
    
                    embedOptions.title = `Name: ${commandName[0].toUpperCase() + commandName.slice(1)}`
                    embedOptions.description = `Description: ${commands[commandName].description}`
    
                }
                else {
                    return await interaction.reply("Command not found")
                }
                
            }
            else {
                embedOptions.fields = Object.entries(commands).map(command => {
                    return {
                        name: command[0],
                        value: command[1].description,
                        inline: true
                    }
                })
            }
    
            return await interaction.reply({
                embeds: [
                    new MessageEmbed(embedOptions)
                ]
            })

        }
        else {
            console.log("Commands Undefined Error")
            return await interaction.reply("Commands not created")
        }

    }
}

