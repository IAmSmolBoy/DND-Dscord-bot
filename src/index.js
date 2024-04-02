// Require the necessary discord.js classes
const fs = require('node:fs');
// const path = require('node:path');
const { Client, Intents, ClientApplication } = require('discord.js');

// Get environment var
require("dotenv").config()

// mongodb
require("./mongodb")

const Character = require("./models/character")






// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.MESSAGE_CONTENT,
    ]
});

// Creating client application
client.application = new ClientApplication(
    client,
    { id: process.env.TESTING_ID, }
)

/* import all the commands from commands folder */
// Read all files in commands folder
const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith('.js'));

// Object to store commands
const commands = {}

// Once client is ready, run this
client.once("ready",
    readyClient => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
        client.user.setActivity("/help for help")
    }
);

// Log in to Discord with the client token
// client.login(process.env.TESTING_TOKEN);
client.login(process.env.TESTING_TOKEN);

// Run code asynchronously
(async () => {
    // Loop through commandFiles
    for (const file of commandFiles) {

        // Get file path and import command
        const filePath = "./commands/" + file;
        const command = require(filePath);

        if ('name' in command && "execute" in command) {

            // Create entry in commands object with key as command name and value as execution function
            commands[command.name] = command

            // Create application command
            // Omits the autocomplete and execute functions from the command object
            await client.application.commands.create({ ...command, autocomplete: null, execute: null,  });

        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" and/or "execute" property.`);
        }

    }

    // client.on("messageCreate", async msg => {

    // })

    // When an interaction is created, run this
    client.on("interactionCreate", async interaction => {

        if(interaction.isApplicationCommand()) {

            const commandName = interaction.commandName
        
            if (commandName in commands) {

                const command = commands[commandName]
        
                switch (commandName) {
                    case "help":
                        command.execute(interaction, commands)
                        break
                    default:
                        command.execute(interaction)
                        break
                }
        
            }
            else {
                interaction.reply("Something has went wrong")
            }

        }

        else if (interaction.isAutocomplete()) {

            const commandName = interaction.commandName
        
            if (commandName in commands && "autocomplete" in commands[commandName]) {
                
                const command = commands[commandName]
        
                switch (commandName) {
                    case "help":
                        command.autocomplete(interaction, commands)
                        break
                    default:
                        command.autocomplete(interaction)
                        break
                }
        
            }
            else {
                interaction.respond([])
            }
        }

    })
})()