const puppeteer = require("puppeteer")

const browser = await puppeteer.launch()
// const browser = await puppeteer.launch({ ignoreDefaultArgs: ['--disable-extensions'] })
const page = (await browser.pages())[0]

await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36")
await page.setViewport({ width: 1356, height: 916 })

async function navigate(link) {
    await page.goto(link)

    try {
        // Wait for page to load
        await (await page.waitForSelector("xpath/html/body")).evaluate(page => page.innerHTML)
        console.log("Successfully navigated to website")

    } catch (e) {
        console.log("Failed to navigate to website: ")
        console.log(e)
    }

    
}

module.exports = {
    
}