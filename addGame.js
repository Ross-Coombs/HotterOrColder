document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addGameForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const lat = document.getElementById('lat').value;
        const lon = document.getElementById('lon').value;

        const newGame = `${name},${lat},${lon}\n`;

        fetch('games.csv', {
            method: 'GET',
            headers: {
                'Content-Type': 'text/csv'
            }
        })
        .then(response => response.text())
        .then(data => {
            const updatedData = data + newGame;
            return fetch('games.csv', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/csv'
                },
                body: updatedData
            });
        })
        .then(() => {
            document.getElementById('message').innerText = 'Game added successfully!';
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('message').innerText = 'Failed to add game.';
        });
    });
});