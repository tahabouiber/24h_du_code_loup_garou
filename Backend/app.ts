function lancerPartie() {
    // Get the input values from HTML
    const wolvesNb = Number((document.getElementById('wolvesNb') as HTMLInputElement).value);
    const villagersNb = Number((document.getElementById('villagersNb') as HTMLInputElement).value);
    const userRole = (document.getElementById('userRole') as HTMLInputElement).value;
    const votePlayer = (document.getElementById('votePlayer') as HTMLInputElement).value;
    const voteReason = (document.getElementById('voteReason') as HTMLInputElement).value;

    // Call the Flask endpoint to launch the game
    fetch('/lancer_partie', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wolvesNb, villagersNb, userRole, votePlayer, voteReason }),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from Flask
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


