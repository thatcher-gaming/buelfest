const yaml = require("js-yaml");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("favicon.ico");
    
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

    eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

    eleventyConfig.addGlobalData("layout", "base.njk")

    eleventyConfig.addGlobalData("eleventyComputed.permalink", function () {
		return (data) => {
			if (data.draft && process.env.NODE_ENV != "development") {
				return false;
			}

			return data.permalink;
		};
	});
}