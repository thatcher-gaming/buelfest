const elem = document.getElementById("summary");

import { animate, spring, stagger } from "https://esm.sh/motion@10.18.0";

const { names, links } = await fetch("/names.json").then(x => x.json());
let shuffled = shuffle(names);
render_summary();
render_main();

function do_the() {
    animate(elem, {
        opacity: 1
    });

    animate("div.the", {
        x: [40, 0],
        opacity: [0, 1],
    }, {
        duration: 2,
        easing: spring({ damping: 40, stiffness: 200 }),
        delay: stagger(0.075),
    });

    setTimeout(async () => {
        await animate_out();
        shuffled = shuffle(names)
        render_summary();
        do_the();

    }, 5000);
}

function shuffle(names) {
    return names
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

function animate_out() {
    return animate("div.the", {opacity: 0}).finished;
}

function render_summary() {
    elem.innerHTML = `<div class="arrow-up" aria-hidden>▶</div>
<div class="arrow-down" aria-hidden>▼</div>
with`;
    const names = shuffled.slice(0, 15);
    for (const name of names) {
        elem.innerHTML += `<div class="the">${name}</div>`
    }
}

function render_main() {
    const namezone = document.getElementById("namezone");
    namezone.innerHTML = "";
    for (const name of shuffled) {
        const link = links[name];
        namezone.innerHTML += link 
        ? `<span class="name"><a href="${link}" target="_blank" rel="noreferrer">${name}</a></span>` 
        : `<span class="name">${name}</span>`
    }
}


do_the();