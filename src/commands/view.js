module.exports = {
	data: {
		name: "view",
		description: 'view all characters',
	},
	execute: async interaction => {
		await interaction.reply('Pong!');
	},
};