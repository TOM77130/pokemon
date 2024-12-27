const API_URL = 'http://localhost:3000';

// Affichage des formulaires
document.getElementById('showRegister').addEventListener('click', () => {
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
});

document.getElementById('showLogin').addEventListener('click', () => {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
});

// Gestion de l'inscription
async function handleRegister() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();
        const messageElement = document.getElementById('registerMessage');
        messageElement.textContent = result.message;
        messageElement.style.color = response.ok ? 'green' : 'red';
    } catch (error) {
        console.error("Erreur d'inscription :", error);
    }
}

// Gestion de la connexion
async function handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();
        const messageElement = document.getElementById('loginMessage');
       
        if (response.ok) {
            messageElement.style.color = 'green';
            messageElement.textContent = result.message;

            // Rediriger vers la page de jeu si la connexion est réussie
            window.location.href = 'accueil.html';  // La page de jeu
        } else {
            messageElement.style.color = 'red';
            messageElement.textContent = result.message;
        }

    } catch (error) {
        console.error("Erreur de connexion :", error);
    }
}
