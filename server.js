const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const csrfProtection = csrf({ cookie: true });

const db = new sqlite3.Database('./mydb.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});


app.use(express.static('public')); // Serve static files from public directory
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

function checkAuth(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/');
    }
}

app.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});


// Login route
app.post('/login', csrfProtection, (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.get(query, [username, password], (err, row) => {
        if (err) {
            res.status(500).send("Erreur lors de la connexion à la base de données");
        } else if (row) {
            req.session.loggedIn = true;
            req.session.username = row.username;
            res.redirect('/accueil');
        } else {
            res.send("Échec de la connexion");
        }
    });
});

// Change password route
app.post('/change-password', csrfProtection, checkAuth, (req, res) => {
    const { username, newPassword } = req.body;
    const updateSql = "UPDATE users SET password = ? WHERE username = ?";
    db.run(updateSql, [newPassword, username], function(err) {
        if (err) {
            res.status(500).send("Erreur lors de la mise à jour du mot de passe");
        } else {
            res.send("Le mot de passe pour l'utilisateur " + username + " a été modifié avec succès.");
        }
    });
});

// Load file route
app.get('/load-file', checkAuth, (req, res) => {
    const fileName = req.query.file;
    const filePath = path.join(__dirname, 'public', fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Erreur lors du chargement du fichier');
        } else {
            res.send(data);
        }
    });
});

app.get('/accueil', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'private', 'accueil.html'));
});

app.get('/admin', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'private', 'admin.html'));
});

app.get('/produits', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'private', 'produits.html'));
});


app.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/accueil');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
