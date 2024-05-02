const yaml = require("js-yaml");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("assets");
    
    eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
}