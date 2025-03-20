document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addGameForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const lat = document.getElementById('lat').value;
        const lon = document.getElementById('lon').value;

        const newGame = {
            name: name,
            lat: lat,
            lon: lon
        };

        fetch('https://9briongeo1.execute-api.eu-north-1.amazonaws.com/default/hotterOrColder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGame)
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('message').innerText = 'Game added successfully!';
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('message').innerText = 'Failed to add game.';
        });
    });
});