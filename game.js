function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        document.getElementById("currentMessage").innerHTML = "Geolocation not supported :(";
    }
    document.getElementById("currentMessage").innerHTML = calcDistance(56.4559872, -2.998272, 56.457922, -2.981056);
}

function showPosition(position) {
    document.getElementById("currentMessage").innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
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