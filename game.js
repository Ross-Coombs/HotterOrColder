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

function showPosition(position) {
    let lat = position.coords.latitude;  // Extract latitude
    let lon = position.coords.longitude; // Extract longitude
    document.getElementById("currentMessage").innerHTML = `Latitude: ${lat} <br>Longitude: ${lon} <br>` + `Distance from target: ${calcDistance(56.4559872, -2.998272, lat, lon).toFixed(2)} km`;
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
    return 6371 * c; // Distance in km (6371 is the radius of Earth in km)
}

function formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let milliseconds = ms % 1000; // Get remaining milliseconds

    // Ensure proper formatting (e.g., 02:05:123)
    return `${String(minutes).padStart(2, '0')}:` + `${String(seconds).padStart(2, '0')}:` + `${String(milliseconds).padStart(3, '0')}`;
}

function timer(startTime) {
    let elapsedTime = Date.now() - startTime;
    document.getElementById("timer").innerHTML = formatTime(elapsedTime);
}

function gameplay() {
    getLocation();
    startTime = Date.now();
    setInterval(() => timer(startTime), 10);
}