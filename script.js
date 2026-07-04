/* ===================================================
   MATCH FLOW v1.0
   Cardigan Town FC Tournament Display
=================================================== */

const SETTINGS_FILE = "config/settings.json";

let divisions = [];
let currentIndex = 0;
let rotationTimer = null;
let tickerMessages = [];
let currentTicker = 0;
let tickerTimer = null;

const frame = document.getElementById("leagueFrame");
const groupsDisplay = document.getElementById("groupsDisplay");
const currentDivision = document.getElementById("currentDivision");
const nextDivision = document.getElementById("nextDivision");
const progressBar = document.getElementById("progressBar");
const tickerText = document.getElementById("tickerText");
const divisionSponsor = document.getElementById("divisionSponsor");
const tournamentDate = document.getElementById("tournamentDate");
const overlayDivision = document.getElementById("overlayDivision");
const overlayClock = document.getElementById("overlayClock");
const afterNextDivision = document.getElementById("afterNextDivision");
const groupAPitch = document.getElementById("groupAPitch");
const groupBPitch = document.getElementById("groupBPitch");
const divisionSponsorCard = document.getElementById("divisionSponsorCard");
const TRANSITION_DELAY = 200;
const FADE_DURATION = 250;

async function loadApplication() {

    try {

        const settingsResponse = await fetch(SETTINGS_FILE);

        if (!settingsResponse.ok) {
            throw new Error("Unable to load settings.json");
        }

        const settings = await settingsResponse.json();

        const playlistResponse = await fetch(`config/${settings.playlist}.json`);

        if (!playlistResponse.ok) {
            throw new Error("Unable to load playlist");
        }

        const playlist = await playlistResponse.json();

divisions = playlist.divisions;

tournamentDate.textContent = playlist.date;

        if (!divisions.length) {
            throw new Error("Playlist is empty");
        }


       if (settings.tickerMessages) {

    tickerText.innerHTML = settings.tickerMessages.join(' <span class="ticker-separator">◆</span> ');

}

        showDivision(0);

    }

    catch (error) {

        console.error(error);

        currentDivision.textContent = "Error";
        nextDivision.textContent = "Check Console";

    }

}

function showDivision(index) {

    clearTimeout(rotationTimer);

    currentIndex = index;

    const division = divisions[index];

    const next = divisions[(index + 1) % divisions.length];
    const afterNext = divisions[(index + 2) % divisions.length];

    currentDivision.textContent = division.name;
    overlayDivision.textContent = division.name;

    nextDivision.textContent = next.name.toUpperCase();
    afterNextDivision.textContent = afterNext.name.toUpperCase();

    divisionSponsor.textContent =
    division.sponsor || "Cardigan Town FC";

   if (division.groups) {

    frame.style.display = "none";
    groupsDisplay.style.display = "block";

    renderGroups(division);

} else {

    frame.style.display = "block";
    groupsDisplay.style.display = "none";

}
if (!division.groups) {

    frame.classList.add("fade-out");

    setTimeout(() => {

        frame.classList.add("fade-out");

        setTimeout(() => {

            frame.src = division.url;

            frame.classList.remove("fade-out");
            frame.classList.add("fade-in");

        }, FADE_DURATION);

    }, TRANSITION_DELAY);

}

    animateProgress(division.duration);

    rotationTimer = setTimeout(() => {

    showDivision((currentIndex + 1) % divisions.length);

}, (division.duration * 1000) + TRANSITION_DELAY);

}

function renderGroups(division) {

    const groupAList = document.getElementById("groupAList");
    const groupBList = document.getElementById("groupBList");

    groupAList.innerHTML = "";
    groupBList.innerHTML = "";

    divisionSponsorCard.textContent = division.sponsor;

    groupAPitch.textContent = division.groups.A.pitch;
    groupBPitch.textContent = division.groups.B.pitch;

    division.groups.A.teams.forEach(team => {

        groupAList.innerHTML += `
            <div class="groupTeam">${team}</div>
        `;

    });

   division.groups.B.teams.forEach(team => {

        groupBList.innerHTML += `
            <div class="groupTeam">${team}</div>
        `;

    });

}

function animateProgress(seconds) {

    progressBar.style.transition = "none";
    progressBar.style.width = "0%";

    void progressBar.offsetWidth;

    progressBar.style.transition = `width ${seconds}s linear`;
    progressBar.style.width = "100%";

}
function startTicker() {

    if (!tickerMessages.length) return;

    clearInterval(tickerTimer);

    tickerTimer = setInterval(() => {

        currentTicker++;

        if (currentTicker >= tickerMessages.length) {

            currentTicker = 0;

        }

        tickerText.textContent = tickerMessages[currentTicker];

    }, 20000);

}

function updateClock(){

    const now = new Date();

    overlayClock.textContent =
        now.toLocaleTimeString("en-GB",{

            hour:"2-digit",

            minute:"2-digit"

        });

}

loadApplication();

updateClock();

setInterval(updateClock,1000);