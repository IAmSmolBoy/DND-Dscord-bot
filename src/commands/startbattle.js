const Character = require("../models/character")

module.exports = {
    name: "startbattle",
    description: "Starts a battle",
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
    ],
    execute: async (interaction) => {

        // Determine subcommand and retrieve command arguments
        const { _subcommand, _hoistedOptions } = interaction.options

        if (_subcommand === "manual") {
            const username = _hoistedOptions[0].value, hp = _hoistedOptions[1].value
            const identifiers = {
                username,
                guildID: interaction.member.guild.id
            }

            const char = await Character.findOne({ identifiers })

            if (char) {
                return interaction.reply(username + " already exists!")
            } 

            await (
                Character({
                    identifiers,
                    currHP: hp,
                    maxHP: hp,
                })
            ).save()

            return interaction.reply(username + " successfully added")

        }
        else if (_subcommand === "link") {

            const link = _hoistedOptions[0].value

            if (link.slice(0, 37) !== "https://www.dndbeyond.com/characters/") {
                return await interaction.reply("Invalid Link!")
            }

            await interaction.deferReply()





            const puppeteer = require("puppeteer")
            
            // const browser = await puppeteer.launch()
            const browser = await puppeteer.launch({ headless: false, ignoreDefaultArgs: ['--disable-extensions'], args: ["--no-sandbox"] })
            // const browser = await puppeteer.launch({ ignoreDefaultArgs: ['--disable-extensions'] })
            const page = (await browser.pages())[0]
            
            await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36")
            await page.setViewport({ width: 1356, height: 916 })
        
            try {

                await page.goto(link)

                // Wait for page to load
                await (await page.waitForSelector("xpath/html/body")).evaluate(page => page.innerHTML)
                console.log("Successfully navigated to website")

                // Check if bot has been detected
                try {
                    await (await page.waitForSelector("/html/body/section/div[3]/div/div")).evaluate(page => page.innerHTML)
                    console.log("Bot detected")
                    return interaction.editReply("Bot has been detected")
                }
                catch (e) {
                    console.log("Bot detection bypass sucessful")
                }








                
                // Object to store selector strings
                const selectorStrs = {
                    username: "xpath/html/body/div[1]/main/div/div/div/div/div[2]/div/div[1]/div[1]/div/div/div/div[2]/div[1]/h1",
                    maxHP: "xpath/html/body/div[1]/main/div/div/div/div/div[2]/div/div[2]/section[3]/div/div[2]/div[2]/div[3]/div[2]/div",
                    currHP: "xpath/html/body/div[1]/main/div/div/div/div/div[2]/div/div[2]/section[3]/div/div[2]/div[2]/div[1]/div[2]/div",
                    skillChecks: "xpath/html/body/div[1]/main/div/div/div/div/div[2]/div/div[3]/div[4]/section/div[2]/div[2]",
                    AC: "xpath/html/body/div[1]/main/div/div/div/div/div[2]/div/div[3]/div[5]/div/div/div[2]/section/div[3]",
                    tempHP: "xpath/html/body/div[1]/main/div/div/div/div/div[2]/div/div[2]/section[3]/div/div[2]/div[3]/div/div[2]/div",
                }

                const data = Object.fromEntries(
                    // Convert to object
                    (await Promise.all(
                        // await for all async functions to run
                        Object.entries(selectorStrs)
                            // Convert selector strings object to entries
                            .map(async selectorStrObj => {

                                const [ name, selectorStr ] = selectorStrObj
                                // Get data name and selector string from selectorStrs
                                const selector = await page.waitForSelector(selectorStr)
                                // Get HTML selectors using selector string

                                // console.log(name, name !== "spellSlots")
                                const rawData = await selector.evaluate(attr => attr.textContent)
                                // extract HTML from spell slot selector

                                return [
                                    name,
                                    rawData
                                ]
                                // return entry to be converted into object
                            })
                    ))
                )


                // Convert data values to int
                data.maxHP = parseInt(data.maxHP)
                data.currHP = parseInt(data.currHP)
                data.AC = parseInt(data.AC)

                // If tempHP is "--", default to 0
                if (data.tempHP === "--") {
                    data.tempHP = 0
                }
                
                // Formatting skill check string into object
                data.skillChecks = Object.fromEntries(
                        data.skillChecks
                        // ^ Example: data.skillChecks = "DEXAcrobatics+7WISAnimal Handling+1INTArcana+1STRAthletics+7CHADeception+2INTHistory+1WISInsight+5CHAIntimidation+2INTInvestigation+1WISMedicine+1INTNature+1WISPerception+5CHAPerformance+2CHAPersuasion+3INTReligion+1DEXSleight of Hand+7DEXStealth+7WISSurvival+1Additional Skills"
                        .slice(3)
                        // ^ data.skillChecks -> "Acrobatics+7WISAnimal Handling+1INTArcana+1STRAthletics+7CHADeception+2INTHistory+1WISInsight+5CHAIntimidation+2INTInvestigation+1WISMedicine+1INTNature+1WISPerception+5CHAPerformance+2CHAPersuasion+3INTReligion+1DEXSleight of Hand+7DEXStealth+7WISSurvival+1Additional Skills"
                        // Regex breakdown:
                        // / -> start of regex, () -> match group
                        // (STR|DEX|...) -> match with literals STR or DEX or ...
                        // /g is global regex flag, which means it will match as many times as possible (I think)
                        // The / regex flag will only match once so .split() will only split once
                        .split(/(STR|DEX|CON|INT|WIS|CHA)/g)
                        // ^ data.skillChecks -> [ 'Acrobatics+7', 'WIS', 'Animal Handling+1', 'INT', 'Arcana+1', 'STR', 'Athletics+7', 'CHA', 'Deception+2', 'INT', 'History+1', 'WIS', 'Insight+5', 'CHA', 'Intimidation+2', 'INT', 'Investigation+1', 'WIS', 'Medicine+1', 'INT', 'Nature+1', 'WIS', 'Perception+5', 'CHA', 'Performance+2', 'CHA', 'Persuasion+3', 'INT', 'Religion+1', 'DEX', 'Sleight of Hand+7', 'DEX', 'Stealth+7', 'WIS', 'Survival+1Additional Skills' ]
                        // .exec() runs the regex on each snippet ^
                        .filter(snippet => !/(STR|DEX|CON|INT|WIS|CHA)/g.exec(snippet))
                        // ^ data.skillChecks -> [ 'Acrobatics+7', 'Animal Handling+1', 'Arcana+1', 'Athletics+7', 'Deception+2', 'History+1', 'Insight+5', 'Intimidation+2', 'Investigation+1', 'Medicine+1', 'Nature+1', 'Perception+5', 'Performance+2', 'Persuasion+3', 'Religion+1', 'Sleight of Hand+7', 'Stealth+7', 'Survival+1Additional Skills' ]
                        .map(snippet => {
                            const [ check, mod ] = snippet.split("+")
                            return [ check, parseInt(mod) ]
                        })
                        // ^ data.skillChecks -> [ [ 'Acrobatics', 7 ], [ 'Animal Handling', 1 ], [ 'Arcana', 1 ], [ 'Athletics', 7 ], [ 'Deception', 2 ], [ 'History', 1 ], [ 'Insight', 5 ], [ 'Intimidation', 2 ], [ 'Investigation', 1 ], [ 'Medicine', 1 ], [ 'Nature', 1 ], [ 'Perception', 5 ], [ 'Performance', 2 ], [ 'Persuasion', 3 ], [ 'Religion', 1 ], [ 'Sleight of Hand', 7 ], [ 'Stealth', 7 ], [ 'Survival', 1 ] ]
                )
                // ^ data.skillChecks -> { Acrobatics: 7, 'Animal Handling': 1, Arcana: 1, Athletics: 7, Deception: 2, History: 1, Insight: 5, Intimidation: 2, Investigation: 1, Medicine: 1, Nature: 1, Perception: 5, Performance: 2, Persuasion: 3, Religion: 1, 'Sleight of Hand': 7, Stealth: 7, Survival: 1 }

                const identifiers = {
                    username: data.username,
                    guildID: interaction.member.guild.id
                }

                const characterParams = {
                    ...data,
                    identifiers,
                    username: undefined,
                    DNDBeyondLink: link,
                }

                // If character already exists, update entr instead of adding new entry
                if (await Character.findOne({ identifiers })) {
                    await Character.findOneAndUpdate(
                        { identifiers },
                        characterParams
                    )

                    interaction.editReply(`${data.username} updated successfully`)
                    browser.close()
                }
                else {
                    await (Character(characterParams)).save()

                    interaction.editReply(`${data.username} added successfully`)
                    browser.close()
                }
        
            } catch (e) {
                console.log("Failed to extract data")
                console.log(e)
                await interaction.editReply("Failed to extract data from DNDBeyond")
            }
        }

    }
}

