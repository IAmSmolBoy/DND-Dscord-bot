// Require the necessary discord.js classes
const fs = require('node:fs');
// const path = require('node:path');
const { Client, Intents, ClientApplication } = require('discord.js');

// Get environment var
require("dotenv").config()

// mongodb
require("./mongodb")

const globals = require("./globals")
var commands = globals.commands
var helpChoices = globals.helpCommandChoices

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
    client, {
        id: process.env.TESTING_ID,
    }
)

/* import all the commands from commands folder */
// Read all files in commands folder
const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith('.js'));

// Loop through commandFiles
for (const file of commandFiles) {

    // Get file path and import command
    const filePath = "./commands/" + file;
    const command = require(filePath);

    if ('data' in command && "execute" in command) {

        // Create entry in commands object with key as command name and value as execution function
        commands[command.data.name] = {
            ...command.data,
            execute: command.execute
        }

        // Create application command
        client.application.commands.create(command.data);

    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" and/or "execute" property.`);
    }

}

helpChoices = Object.keys(commands).map(command => {
    return {
        name: command,
        value: command
    }
})

// Once client is ready, run this
client.once("ready",
    readyClient => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    }
);

// client.on("messageCreate", async msg => {

// })

// When an interaction is created, run this
client.on("interactionCreate", async interaction => {

    if(interaction.isApplicationCommand()) {

        const commandName = interaction.commandName
        const command = commands[commandName]
    
        if (commandName in commands) {
    
            switch (commandName) {
                case "help":
                    command.execute(interaction, commands)
                    break
                default:
                    command.execute(interaction)
                    break
            }
    
        }

    }

    else if (interaction.isAutocomplete()) {
        interaction.respond(helpChoices)
    }

})

// Log in to Discord with your client's token
client.login(process.env.TESTING_TOKEN);