module.exports = class {
    data() {
        return {
            layout: false,
            permalink: "/names.json",
        }
    }

    render({ lineup: { names } }) {
        return JSON.stringify(names);
    }

}