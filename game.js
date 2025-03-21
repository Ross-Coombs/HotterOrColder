let latlons = new URLSearchParams(window.location.search); //for campus green: ?lat=56.458300&lon=-2.982235
let targetLat = latlons.get("lat");
let targetLon = latlons.get("lon");
console.log(`Target Lat: ${targetLat} Lon: ${targetLon}`);
let winThreshold = 20; //how far away from target the player needs to be to win
let watchID;
function getLocation() {
    if (navigator.geolocation) {
        console.log("Getting location");
        navigator.geolocation.getCurrentPosition(firstPosition, handleError); //force getting location on load
        watchID = navigator.geolocation.watchPosition(showPosition, handleError); //continuously update position
    } else {
        document.getElementById("currentMessage").innerHTML = "Geolocation not supported :(";
    }
}

function handleError(error) {
    console.log("Error getting location:", error);
    document.getElementById("currentMessage").innerHTML = "Can't find you!<br>Check location settings";
}

let lastLocUpdate;
let previousLat;
let previousLon;
let latNow;
let lonNow;
function firstPosition(position) {
    lastLocUpdate = Date.now();
    latNow = position.coords.latitude;  // Extract latitude
    lonNow = position.coords.longitude; // Extract longitude
    console.log(`Got First Position\nLatitude: ${latNow}\nLongitude: ${lonNow}\n` + `Distance from target: ${calcDistance(targetLat, targetLon, latNow, lonNow).toFixed(3)} m\n`);
}

function showPosition(position) {
    lastLocUpdate = Date.now();
    previousLat = latNow;
    previousLon = lonNow;
    latNow = position.coords.latitude;  // Extract latitude
    lonNow = position.coords.longitude; // Extract longitude
    console.log(`Updated Position\nLatitude: ${latNow}\nLongitude: ${lonNow}\n` + `Distance from target: ${calcDistance(targetLat, targetLon, latNow, lonNow).toFixed(3)} m\n` + `Distance from previous location: ${calcDistance(previousLat, previousLon, latNow, lonNow).toFixed(3)} m\n` + `Distance from location on 3.5s timer: ${calcDistance(intervalLat, intervalLon, latNow, lonNow).toFixed(3)} m`);
    if (calcDistance(targetLat, targetLon, latNow, lonNow) < winThreshold) { //is the player <5m away from target?
        document.getElementById("gameBody").classList = "gameWarm3";
        endGame();
        return;
    }    
}

//calculate distance using the haversine formula
function calcDistance(lat1, lon1, lat2, lon2) {
    //convert distances in lat and long into radians
    const toRad = (angle) => angle * (Math.PI / 180);
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    //haversine formula
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (6371 * c)*1000; // Distance in m (6371 is the radius of Earth in km)
}

let intervalLat;
let intervalLon;
let progress;
function checkProgress() {
    if (Date.now()-lastLocUpdate > 3500) {
        console.log(`Progress Check: Location not updated since last check\nLocation last updated: ${lastLocUpdate}`)
        return;
    }
    let howMuchCloser = calcDistance(targetLat, targetLon, intervalLat, intervalLon) - calcDistance(targetLat, targetLon, latNow, lonNow);
    let howFarAway = calcDistance(targetLat, targetLon, latNow, lonNow);
    console.log(`Progress Check\n` + `Distance from previous check: ${calcDistance(intervalLat, intervalLon, latNow, lonNow).toFixed(3)} m\n` + `Change in distance to target: ${howMuchCloser}m`)
    if (howFarAway < winThreshold) { //is the player a winning distance away from target?
        document.getElementById("gameBody").classList = "gameWarm3";
        endGame();
        return;
    } else if (howFarAway < 30 && howMuchCloser > 5) { //is the player close to the target AND moving closer?
        document.getElementById("currentMessage").innerHTML = "BOILING HOT!";
        document.getElementById("gameBody").classList = "gameWarm3";
    } else if (howFarAway < 30) { //is the player close to the target but not moving closer?
        document.getElementById("currentMessage").innerHTML = "HOT HOT HOT! Keep moving!";
        document.getElementById("gameBody").classList = "gameWarm3";
    } else if (howMuchCloser > -2 && howMuchCloser < 2) { //is the player not moving?
        document.getElementById("currentMessage").innerHTML = "Move around!";
        document.getElementById("gameBody").classList = "game";
    } else if (howMuchCloser > 10) { //is the player getting lots closer?
        document.getElementById("currentMessage").innerHTML = "Hotter!";
        document.getElementById("gameBody").classList = "gameWarm2";
    } else if (howMuchCloser > 0) { //is the player getting a bit closer?
        document.getElementById("currentMessage").innerHTML = "Getting Warmer!";
        document.getElementById("gameBody").classList = "gameWarm1";
    } else if (howMuchCloser < -10) { //is the player getting lots further away?
        document.getElementById("currentMessage").innerHTML = "Colder!";
        document.getElementById("gameBody").classList = "gameCold2";
    } else if (howMuchCloser < 0) { //is the player getting a bit further away?
        document.getElementById("currentMessage").innerHTML = "Getting Cooler!";
        document.getElementById("gameBody").classList = "gameCold1";
    } else { //catch all
        document.getElementById("currentMessage").innerHTML = "Getting Location..."
        document.getElementById("gameBody").classList = "game";
    }
    intervalLat = latNow;
    intervalLon = lonNow;
}

function endGame() {
    // Stop location tracking
    if (watchID) {
        navigator.geolocation.clearWatch(watchID);
    }
    // Stop the timer and progress checks
    clearInterval(timerIntervalID);
    clearInterval(progressIntervalID);
    //win screen
    document.getElementById("currentMessage").innerHTML = `WIN!<br>${document.getElementById("timer").innerHTML}<br><a href="home.html"><button>Home</button></a>`;
    console.log(`Game won in ${document.getElementById("timer").innerHTML}`);
    document.getElementById("timer").remove();
}

function formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    // Ensure proper formatting (e.g., 02:05)
    return `${String(minutes).padStart(2, '0')}:` + `${String(seconds).padStart(2, '0')}`;
}

function timer(startTime) {
    let elapsedTime = Date.now() - startTime;
    document.getElementById("timer").innerHTML = formatTime(elapsedTime);
}

let timerIntervalID;
let progressIntervalID;
function gameplay() {
    getLocation();
    let startTime = Date.now();
    timerIntervalID = setInterval(() => timer(startTime), 100);
    progressIntervalID = setInterval(() => checkProgress(), 3500);
}