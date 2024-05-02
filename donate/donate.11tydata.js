const eleventy_fetch = require("@11ty/eleventy-fetch");
const { AssetCache } = require("@11ty/eleventy-fetch");
const image_fetch = require("@11ty/eleventy-img");
const cheerio = require("cheerio");

async function scrape_gofundme(data) {
    const parsed = []

    for (const { url } of data) {
        parsed.push(await grab_data(url));
    }

    return parsed;
}

const max_age = "1d"

async function grab_data(url) {
    const data = await eleventy_fetch(url, {
        duration: max_age,
        type: "text",
    });

    // we want to cache the result of the scraping as well as the network
    // request (it takes a sec!)
    let asset = new AssetCache(url + "parsed");

    // if it's not stale, return it
    if (asset.isCacheValid(max_age)) {
        return asset.getCachedValue();
    }

    const $ = cheerio.load(data);

    const title = $(".p-campaign-title").text();
    // this just grabs a css utility class that the main description text
    // happens to have. this will break!! but yknow. hopefully AFTER the fest.
    const desc = $(".p-campaign-description .hrt-mt-3").text();

    const image_url = $(".p-campaign picture img").prop("src");
    const image = await image_fetch(image_url, {
        outputDir: "_site/img/"
    });

    const sidebar = $(".p-campaign-sidebar");
    // nightmare
    const meter = sidebar.find("div[class^=progress-meter_progressMeterHeading]")
    // remove formatting from number
    const current_str = meter.children().first().text().replace(",", "").slice(1);
    // same deal as above
    const goal_str = meter.find(".hrt-text-body-sm")
        .text()
        .replace(",", "")
        .split(" ")
        .find(x => x.startsWith("$"))
        .slice(1);

    // make them numbers (idk why)
    const current = Number(current_str);
    const goal = Number(goal_str);

    const result = {
        title,
        desc,
        url,
        image,
        current,
        goal,
    };

    // cache the result
    await asset.save(result, "json");

    return result;
}

module.exports = {
    eleventyComputed: {
        gofundmes: (data) => {
            const gofundmes = data.donations.gofundmes;
            return scrape_gofundme(gofundmes);
        }
    },
}