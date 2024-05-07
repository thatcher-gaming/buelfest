const button = document.getElementById("music_button");
if (!button) throw "no button";

let audio = null, playing = false;

button.addEventListener("click", () => !audio || audio?.paused ? music_on() : music_off())

function music_on() {
    if (!audio) { 
        audio = new Audio('/assets/music.opus');
        audio.loop = true;
    }

    audio.play();
    button.innerText = "Music Off"
}

function music_off() {
    audio?.pause();
    button.innerText = "Music On"
}

