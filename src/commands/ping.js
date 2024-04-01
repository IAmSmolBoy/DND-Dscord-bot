module.exports = {
	name: "ping",
	description: 'Ping the bot',
	execute: async interaction => {
		await interaction.reply('Pong!');
	},
};