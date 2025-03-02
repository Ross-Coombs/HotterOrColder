let watchID;
function getLocation() {
    if (navigator.geolocation) {
        watchID = navigator.geolocation.watchPosition(showPosition, handleError);
    } else {
        document.getElementById("currentMessage").innerHTML = "Geolocation not supported :(";
    }
}

function handleError(error) {
    console.log("Error getting location:", error);
    document.getElementById("currentMessage").innerHTML = "Can't find you<br>check location settings";
}

let previousLat;
let previousLon;
let latNow;
let lonNow;
function showPosition(position) {
    previousLat = latNow;
    previousLon = lonNow;
    latNow = position.coords.latitude;  // Extract latitude
    lonNow = position.coords.longitude; // Extract longitude
    console.log(`Latitude: ${latNow}\nLongitude: ${lonNow}\n` + `Distance from target: ${calcDistance(56.4579548, -2.9810812, latNow, lonNow).toFixed(3)} m\n` + `Distance from previous location: ${calcDistance(previousLat, previousLon, latNow, lonNow).toFixed(3)} m`);
    //document.getElementById("currentMessage").innerHTML = `Distance from target: ${calcDistance(56.4579548, -2.9810812, latNow, lonNow).toFixed(2)} m`;
    document.getElementById("currentMessage").innerHTML = `Distance from previous location: ${calcDistance(previousLat, previousLon, latNow, lonNow).toFixed(2)} m`;
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
}