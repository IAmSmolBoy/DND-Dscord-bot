module.exports = {
    name: "saving",
    description: "Rolls a Death Saving Throw",
    execute: async interaction => {
        interaction.reply(`Saving throw: ${Math.ceil(Math.random() * 20)}`)
    }
}