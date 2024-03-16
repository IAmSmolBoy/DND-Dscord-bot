const { sendFormatErr, findCampaign } = require("../util")
const { newObj, edit } = require("../mongodb")

const puppeteer = require("puppeteer")

module.exports = async function ({ args, channel, format, guild }) {
    /*                         Error Handling                         */
    if (args.length !== 1) {
        return sendFormatErr(channel, format)
    }

    const [link] = args
    if (link.slice(0, 37) !== "https://www.dndbeyond.com/characters/") {
        return channel.send("The link is invalid")
    }






    /*                         Setting Up test browser and Extracting Info                         */
    channel.send("Please wait. Extracting character sheet information...")
    const browser = await puppeteer.launch()
    // const browser = await puppeteer.launch({ignoreDefaultArgs: ['--disable-extensions']})
    const page = (await browser.pages())[0]

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36")
    await page.goto(link)
    await page.setViewport({ width: 1356, height: 916 })

    // Wait for page to load
    await (await page.waitForSelector("xpath/html/body")).evaluate(page => page.innerHTML)

    try {
        const PCNameH1 = await page.waitForSelector("xpath/html/body/div[1]/main/div[1]/div/div/div/div[2]/div/div[1]/div[1]/div/div/div/div[2]/div[1]/h1")
        const PCHPDiv = await page.waitForSelector("xpath/html/body/div[1]/main/div[1]/div/div/div/div[2]/div/div[2]/section[3]/div/div[2]/div[2]/div[3]/div[2]/div")

        const PCName = await PCNameH1.evaluate(h1 => h1.innerHTML);
        const PCHP = await PCHPDiv.evaluate(div => div.innerHTML);

        // --------------------------------------- Extracting Skill Checks ---------------------------------------

        // Get Skill Check Divs
        const skillCheckListItems = await page.$$(".ct-skills__item")

        // Gets innerHTML and from that, gets the skill check name and bonus
        function skillCheckEvaluate(div) {
            // List Item HTML
            const skillDetails = div.innerText.split("\n")

            // Getting Skill Check Name and Bonus

            return {
                skillCheck: skillDetails[1],
                bonus: skillDetails[2] + skillDetails[3]
            }
        }

        // Get Skill Checks
        const skillCheckList = await Promise.all(
            skillCheckListItems.map(skillCheckDiv => skillCheckDiv.evaluate(skillCheckEvaluate))
        )

        // Display Skills and Formatting
        const skillChecks = {}
        var skillCheckMsg = "---------------------- Skill Checks ----------------------\n"
        for (const skill of skillCheckList) {
            skillCheckMsg += `${skill.skillCheck}: ${skill.bonus}\n`
            skillChecks[skill.skillCheck] = skill.bonus
        }

        // --------------------------------------- Extracting Spell Slots ---------------------------------------

        var spellSlotMsg = ""
        var spellSlots = []

        // Go to spells tab
        const spellTab = await page.$(".ct-primary-box__tab--spells .ddbc-tab-list__nav-item-label")
        if (spellTab) {
            await spellTab.click()

            // Getting all number of spell slots
            const spellSlotDivs = await page.$$(".ct-slot-manager.ct-slot-manager--size-small")

            // Gets innerHTML and gets the number of checkboxes in the each div
            function divEvaluate(div) {
                const checkboxHTML = '<div role="checkbox" aria-checked="false" aria-label="use" class="ct-slot-manager__slot"></div>'
                return div.innerHTML.split(checkboxHTML).length - 1
            }

            // Loops through spellSlotDivs and awaits each Promise returned from the evaluate
            spellSlots = await Promise.all(
                spellSlotDivs.map(spellSlotDiv => spellSlotDiv.evaluate(divEvaluate))
            )

            // Display spell slots
            spellSlotMsg = "---------------------- Spell Slots ----------------------\n"
            spellSlots.forEach(function (spellSlots, i) {
                spellSlotMsg += `${i + 1}`
                switch (i) {
                    case 0:
                        spellSlotMsg += "st"
                        break
                    case 1:
                        spellSlotMsg += "nd"
                        break
                    case 2:
                        spellSlotMsg += "rd"
                        break
                    default:
                        spellSlotMsg += "th"
                        break
                }
                spellSlotMsg += ` level: ${spellSlots} slots\n`
            })
        }

        browser.close()

        // --------------------------------------- Display Character Sheet ---------------------------------------
        var characterSheetMsg = `Name: ${PCName}\nHP: ${PCHP}/${PCHP}\n\t${skillCheckMsg}\n\t${spellSlotMsg}`
        channel.send(characterSheetMsg)







        /*                         Add Character to Database                         */
        const charObj = {
            username: PCName,
            maxHP: PCHP,
            currHP: PCHP,
            skillChecks,
            link: args[0]
        }
        if (spellSlots.length > 0) {
            charObj.spellSlots = spellSlots
        }

        // Saves character into MongoDB
        const newChar = newObj("Char", charObj)

        // Get Campaign
        const campaign = await findCampaign(guild.id)

        // Check if the character exists
        const existing = campaign.characters.findIndex(char => char.username === PCName)

        var editOptions = {
            $push: {
                characters: newChar
            }
        }

        if (existing > -1) {
            editOptions = {
                $set: {}
            }

            editOptions["$set"][`characters.${existing}`] = newChar

            console.log(editOptions)

            // If character already exists, character is edited
            channel.send(`${PCName} updated`)
        }
        else {
            channel.send(`${PCName} added`)
        }

        // Adding/Updating character
        await edit("Campaign", {
            guildId: guild.id
        }, editOptions)
    } catch (e) {
        console.log(e)
        channel.send("Failed to retrieve character sheet from DNDBeyond. Blame them for being big gae.")
    }
}