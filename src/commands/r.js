module.exports = {
	name: "r",
	description: 'Roll your dice',
	options: [
		{
			type: 3,
			name: "dice",
			description: "<number of dice rolled>d<number of dice faces>+<modifier>",
			required: true,
		}
	],
	execute: async interaction => {

		// Delete all whitespace in dice
		const dice = interaction.options._hoistedOptions[0].value.replace(/\s/g, "")

		// If dice does not contain "d", dice is invalid
		if (!dice.includes("d")) return await interaction.reply("Invalid dice!")
		
		// Get the number of dice to roll, number of faces and modifier for roll
		const diceNumbers = dice.split("d")

		// Number of dice will default to 1 and mod will default to 0
		var diceNum = 1, faces = diceNumbers[1], mod = 0

		// If there are characters in front of "d" and they are NaN, dice will be invalid.
		if (diceNumbers[0] !== "") {
			if (isNaN(diceNumbers[0])) return await interaction.reply("Invalid dice!")

			diceNum = parseInt(diceNumbers[0])
		}

		// Split number of faces and roll modifier
		if (faces.includes("+") || faces.includes("-")) {
			var facesNmod = []

			if (faces.includes("+")) {
				facesNmod = faces.split("+")
			}
			if (faces.includes("-")) {
				facesNmod = faces.split("-")
				facesNmod[1] = "-" + facesNmod[1]
			}

			// if either number of faces or modifier are empty or NaN, dice is invalid
			if (isNaN(facesNmod[0]) || facesNmod[0] === "" || isNaN(facesNmod[1]) || facesNmod[1] === "") return await interaction.reply("Invalid dice!")

			faces = parseInt(facesNmod[0])
			mod = parseInt(facesNmod[1])
		}
		else {
			// If number of faces is an empty string or NaN, dice is invalid
			if (isNaN(faces) || faces === "") return await interaction.reply("Invalid dice!")

			faces = parseInt(faces)
		}

		

		// Roll the dice and add into an array
		var rolls = []
		for (var i = 0; i < diceNum; i++) {
			rolls.push(Math.random() * faces)
		}

		// Total up the rolls
		const total = Math.ceil(rolls.reduce((a, v) => a + v) + mod)

		// Put rolled values in () and add mod into rolls list without ()
		rolls = rolls.map(roll => `(${Math.ceil(roll)})`)
		rolls.push(`${mod}`)

		// Create display message to display
		const displayMsg = rolls.join(" + ") + ` = ${total}`

		await interaction.reply(displayMsg);
	},
};