document.addEventListener('DOMContentLoaded', function() {
    fetch('https://9briongeo1.execute-api.eu-north-1.amazonaws.com/default/hotterOrColder')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log the response to see its structure
            if (Array.isArray(data)) {
                generateButtons(data);
            } else {
                console.error('Unexpected response format:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching games:', error);
        });

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
});