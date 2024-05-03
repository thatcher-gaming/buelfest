module.exports = class {
    data = {
        permalink: "/donate.json"
    }

    render(data) {
        return JSON.stringify({
            gofundmes: data.gofundmes,
            charities: data.donations.charities
        });
    }
}