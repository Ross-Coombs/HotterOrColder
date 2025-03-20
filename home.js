document.addEventListener('DOMContentLoaded', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            fetch('https://9briongeo1.execute-api.eu-north-1.amazonaws.com/default/hotterOrColder')
                .then(response => response.json())
                .then(data => {
                    console.log(data); // Log the response to see its structure
                    if (Array.isArray(data)) {
                        const sortedLocations = sortLocationsByDistance(data, userLat, userLon);
                        generateButtons(sortedLocations);
                    } else {
                        console.error('Unexpected response format:', data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching games:', error);
                });
        }, function(error) {
            console.error('Error getting location:', error);
            document.getElementById('message').innerText = 'Failed to get location.';
        });
    } else {
        document.getElementById('message').innerText = 'Geolocation is not supported by this browser.';
    }

    function sortLocationsByDistance(locations, userLat, userLon) {
        return locations.map(location => {
            const distance = calcDistance(userLat, userLon, parseFloat(location.lat), parseFloat(location.lon));
            console.log(`Distance to ${location.name}: ${distance.toFixed(2)} m`);
            return { ...location, distance };
        }).sort((a, b) => a.distance - b.distance);
    }

    function generateButtons(locations) {
        const container = document.getElementById('gameButtonsContainer');
        locations.forEach(location => {
            const button = document.createElement('button');
            button.innerHTML = location.name;
            button.onclick = () => {
                window.location.href = `game.html?lat=${location.lat}&lon=${location.lon}`;
            };
            container.appendChild(button);
        });
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
        return (6371 * c) * 1000; // Distance in m (6371 is the radius of Earth in km)
    }
});