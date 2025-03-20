document.addEventListener('DOMContentLoaded', function() {
    fetch('https://your-api-id.execute-api.your-region.amazonaws.com/your-stage/games')
        .then(response => response.json())
        .then(data => {
            generateButtons(data);
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