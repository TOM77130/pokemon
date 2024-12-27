const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Initialisation de la base de données SQLite
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            items TEXT DEFAULT '[]'
        )
    `);
    console.log("Table des utilisateurs créée.");
});

// Middleware pour stocker l'utilisateur connecté
let currentUser = null;

// Endpoint pour l'inscription
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis." });
    }

    try {
        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
            if (err) {
                return res.status(500).json({ message: "Erreur interne du serveur." });
            }
            if (user) {
                return res.status(400).json({ message: "Nom d'utilisateur déjà pris." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
                if (err) {
                    return res.status(500).json({ message: "Erreur lors de l'inscription." });
                }
                res.status(201).json({ message: "Inscription réussie !" });

                // Afficher toutes les lignes de la table 'users'
                db.all('SELECT * FROM users', [], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    console.log('Contenu de la table users :', rows); // Affiche toutes les lignes de la table
                });

            });
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'inscription." });
    }
});

// Endpoint pour la connexion
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis." });
    }

    try {
        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
            if (err) {
                return res.status(500).json({ message: "Erreur interne du serveur." });
            }
            if (!user) {
                return res.status(400).json({ message: "Utilisateur non trouvé." });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Mot de passe incorrect." });
            }

            currentUser = { id: user.id, username: user.username }; // Stocke l'utilisateur connecté

            res.json({ message: "Connexion réussie !", user: currentUser });
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion." });
    }
});

// Endpoint pour vérifier l'utilisateur connecté
app.get('/current-user', (req, res) => {
    if (currentUser) {
        res.json({ user: currentUser });
    } else {
        res.status(401).json({ message: "Aucun utilisateur connecté." });
    }
});


// Endpoint pour ajouter des nombres tirés à l'utilisateur connecté
app.post('/add-items', (req, res) => {
    const { username, items } = req.body; // Les nombres tirés et le nom d'utilisateur

    if (!username || !items) {
        return res.status(400).json({ message: "Nom d'utilisateur et items requis." });
    }

    db.get(`SELECT items FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }

        if (!row) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        // Ajouter les nouveaux items à la liste existante
        const existingItems = JSON.parse(row.items || '[]');
        const updatedItems = [...existingItems, ...items];

        db.run(
            `UPDATE users SET items = ? WHERE username = ?`,
            [JSON.stringify(updatedItems), username],
            (err) => {
                if (err) {
                    return res.status(500).json({ message: "Erreur lors de la mise à jour des items." });
                }

                res.json({ message: "Items ajoutés avec succès.", items: updatedItems });
            }
        );
    });
});



// Lancer le serveur
app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});
