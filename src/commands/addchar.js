const Character = require("../models/character")

module.exports = {
    data: {
        name: "addchar",
        description: "Add a character using DNDBeyond or manually entering details",
        options: [
            {
                type: 1,
                name: "link",
                description: "Add character by entering your DNDBeyond Link >",
                options: [
                    {
                        type: 3,
                        name: "sheeturl",
                        required: true,
                        description: "The link to your character sheet"
                    }
                ]
            },
            {
                type: 1,
                name: "manual",
                description: "Add character by entering name and maxHP",
                options: [
                    {
                        type: 3,
                        name: "name",
                        required: true,
                        description: "Your character's name",
                    },
                    {
                        type: 4,
                        name: "maxhp",
                        required: true,
                        description: "Your character's maxHP",
                    }
                ]
            }
        ]
    },
    execute: async (interaction) => {

        // Determine subcommand and retrieve command arguments
        const { _subcommand, _hoistedOptions } = interaction.options
        const username = _hoistedOptions[0].value, hp = _hoistedOptions[1].value

        if (_subcommand === "manual") {

            if (await Character.findOne({ username: username })) {
                return interaction.reply("Character already exists!")
            }

            const charArgs = {
                username,
                guildID: interaction.member.guild.id,
                currHP: hp,
                maxHP: hp,
            }

            const res = await (Character(charArgs)).save()

            console.log(res)

            return interaction.reply(res)

        }

    }
}

