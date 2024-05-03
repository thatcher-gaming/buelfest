const eleventy_fetch = require("@11ty/eleventy-fetch");
const { AssetCache } = require("@11ty/eleventy-fetch");
const image_fetch = require("@11ty/eleventy-img");
const cheerio = require("cheerio");

async function scrape_gofundme(data) {
    const parsed = []

    for (const thing of data) {
        if (Object.keys(thing).length == 0) continue;
        parsed.push(await grab_data(thing));
    }

    return parsed;
}

const max_age = "1h"

async function grab_data({ url, ...bonus }) {
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
        outputDir: "_site/img/",
        formats: ['avif', 'webp', 'jpg'],
    });

    const image_markup = image_fetch.generateHTML(image, {
        alt: `header image for ${title}`,
        loading: "lazy",
        decoding: "async",
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
        .find(x => x.match(/^(\$|£|€)/)) ?? "$0";

    const sym = goal_str[0];
    const currency = (() => {
        switch (sym) {
            case "$": return "usd";
            case "€": return "eur";
            case "£": return "gbp";
        }
    })();

    // make them numbers
    const numbers = {
        current: Number(current_str),
        goal: Number(goal_str.slice(1)),
        difference: Number(goal_str.slice(1)) - Number(current_str),
    }

    const formatted = {
        current: sym + numbers.current.toLocaleString(undefined, { currency }),
        goal: sym + numbers.goal.toLocaleString(undefined, { currency })
    }

    const result = {
        title,
        desc,
        url,
        image,
        image_markup,
        numbers,
        formatted,
        tags: bonus.tags,
    };

    // cache the result
    await asset.save(result, "json");

    return result;
}

module.exports = {
    eleventyComputed: {
        gofundme: (data) => {
            const gofundmes = data.donations.gofundmes;
            return scrape_gofundme(gofundmes);
        }
    },
}