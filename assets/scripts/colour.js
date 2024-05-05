const random_rgb = () => Array(0, 0, 0).map(_ =>
    Math.floor(Math.random() * 256)
);

const rgb_to_hex = (rgb) => rgb.map(x =>
    x
        .toString(16)
        .padStart(2, '0')
).join('');

const gamma = 2.4;

const luminance = (rgb) => {
    const [r, g, b] = rgb.map((v) => {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, gamma);
    });
    return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

const target_ratio = 8;

const find_nice_combo = () => {
    while (true) {
        const [a, b] = Array(null, null).map(_ => random_rgb());

        const lum_a = luminance(a);
        const lum_b = luminance(b);
        const brightest = Math.max(lum_a, lum_b);
        const darkest = Math.min(lum_a, lum_b);

        const ratio = (brightest + 0.05) / (darkest + 0.05);

        if (ratio >= target_ratio) return [a, b].map(x => "#" + rgb_to_hex(x))
    }
}

// check if the last navigation was the result of a reload or clicking on a 
// hyperlink.
const reloaded = () => {
    const entry = window.performance.getEntriesByType("navigation")?.[0];
    if (!entry) return false;
    return entry.type == "reload"
}

const key = "colours";

export const get_colours = () => {
    return JSON.parse(sessionStorage.getItem(key));
}

// persist the colour scheme until the page is reloaded
const session = sessionStorage.getItem(key);
const [bg, fg] = session && !reloaded()
    ? JSON.parse(session)
    : find_nice_combo();

sessionStorage.setItem(key, JSON.stringify([bg, fg]));

const root = document.querySelector(':root');
root.style.setProperty("--bg", bg);
root.style.setProperty("--fg", fg);