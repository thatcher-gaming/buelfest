module.exports = class {
    data() {
        return {
            layout: false,
            permalink: "/names.json",
        }
    }

    render({ lineup }) {
        return JSON.stringify(lineup);
    }

}