document.addEventListener('DOMContentLoaded', function() {
    fetch('games.csv')
        .then(response => response.text())
        .then(data => {
            Papa.parse(data, {
                header: true,
                complete: function(results) {
                    generateButtons(results.data);
                }
            });
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