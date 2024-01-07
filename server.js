const express = require('express');
const app = express();
const path = require('path');

// Servez les fichiers statiques (CSS, JS, images, etc.) depuis un dossier 'public'
app.use(express.static('public')); 

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Route pour la page 'admin.html'
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/admin.html'));
});

// Route pour la page 'contact.html'
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/contact.html'));
});

// Route pour la page 'produits.html'
app.get('/produits', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/produits.html'));
});

// Définir le port sur lequel le serveur doit écouter
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
