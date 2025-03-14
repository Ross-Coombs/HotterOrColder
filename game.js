let latlons = new URLSearchParams(window.location.search); //for campus green: ?lat=56.458300&lon=-2.982235
let targetLat = latlons.get("lat");
let targetLon = latlons.get("lon");
console.log(`Target Lat: ${targetLat} Lon: ${targetLon}`);
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
    console.log(`Updated Position\nLatitude: ${latNow}\nLongitude: ${lonNow}\n` + `Distance from target: ${calcDistance(targetLat, targetLon, latNow, lonNow).toFixed(3)} m\n` + `Distance from previous location: ${calcDistance(previousLat, previousLon, latNow, lonNow).toFixed(3)} m\n` + `Distance from location on 5s timer: ${calcDistance(intervalLat, intervalLon, latNow, lonNow).toFixed(3)} m`);
    //document.getElementById("currentMessage").innerHTML = `Distance from previous location: ${calcDistance(previousLat, previousLon, latNow, lonNow).toFixed(2)} m`;
    //document.getElementById("currentMessage").innerHTML = `Latitude: ${latNow}<br>Longitude: ${lonNow}<br>` + `Distance from target: ${calcDistance(targetLat, targetLon, latNow, lonNow).toFixed(3)} m<br>` + `Distance from previous location: ${calcDistance(previousLat, previousLon, latNow, lonNow).toFixed(3)} m<br>` + `Distance from location on 5s timer: ${calcDistance(intervalLat, intervalLon, latNow, lonNow).toFixed(3)} m`;
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
    if (Date.now()-lastLocUpdate > 5000) {
        console.log(`Progress Check: Location not updated since last check\nLocation last updated: ${lastLocUpdate}`)
        return;
    }
    let howMuchCloser = calcDistance(targetLat, targetLon, intervalLat, intervalLon) - calcDistance(targetLat, targetLon, latNow, lonNow);
    let howFarAway = calcDistance(targetLat, targetLon, latNow, lonNow);
    console.log(`Progress Check\n` + `Distance from previous check: ${calcDistance(intervalLat, intervalLon, latNow, lonNow).toFixed(3)} m\n` + `Change in distance to target: ${howMuchCloser}m`)
    if (howFarAway < 5) { //is the player <5m away from target?
        document.getElementById("currentMessage").innerHTML = "WIN!";
        document.getElementById("game").id = "gameWarm3"
    } else if (howFarAway < 20 && howMuchCloser > 10) { //is the player close to the target AND moving closer?
        document.getElementById("currentMessage").innerHTML = "BOILING HOT!";
        document.getElementById("game").id = "gameWarm3"
    } else if (howFarAway < 20) { //is the player close to the target but not moving closer?
        document.getElementById("currentMessage").innerHTML = "HOT HOT HOT! Keep moving!";
        document.getElementById("game").id = "gameWarm3"
    } else if (howMuchCloser > -3 && howMuchCloser < 3) { //is the player not moving?
        document.getElementById("currentMessage").innerHTML = "Move around!";
        document.getElementById("game").id = "game"
    } else if (howMuchCloser > 10) { //is the player getting lots closer?
        document.getElementById("currentMessage").innerHTML = "Hotter!";
        document.getElementById("game").id = "gameWarm2"
    } else if (howMuchCloser > 0) { //is the player getting a bit closer?
        document.getElementById("currentMessage").innerHTML = "Getting Warmer!";
        document.getElementById("game").id = "gameWarm1"
    } else if (howMuchCloser < -10) { //is the player getting lots further away?
        document.getElementById("currentMessage").innerHTML = "Colder!";
        document.getElementById("game").id = "gameCold2"
    } else if (howMuchCloser < 0) { //is the player getting a but further away?
        document.getElementById("currentMessage").innerHTML = "Getting Cooler!";
        document.getElementById("game").id = "gameCold1"
    } else { //catch all
        document.getElementById("currentMessage").innerHTML = "Lets get moving!"
        document.getElementById("game").id = "game"
    }
    intervalLat = latNow;
    intervalLon = lonNow;
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

function gameplay() {
    getLocation();
    let startTime = Date.now();
    setInterval(() => timer(startTime), 100);
    setInterval(() => checkProgress(), 5000);
}