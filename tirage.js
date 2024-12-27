/*
// Fonction pour générer 5 nombres aléatoires
function tirerNombresAleatoires(min, max) {
    const nombres = [];
    while (nombres.length < 5) {
        const nombre = Math.floor(Math.random() * (max - min + 1)) + min;
        nombres.push(nombre);
    }
    return nombres;
}

// Fonction pour récupérer les informations de l'utilisateur connecté
async function getCurrentUser() {
    try {
        const response = await fetch("http://localhost:3000/current-user");
        if (!response.ok) {
            throw new Error("Impossible de récupérer les informations de l'utilisateur connecté.");
        }
        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error("Erreur : ", error);
        return null;
    }
}

// Ajout d'un événement au clic du bouton
document.getElementById("tirer").addEventListener("click", async () => {
    const currentUser = await getCurrentUser();

    if (currentUser) {
        const nombres = tirerNombresAleatoires(50, 55);
        console.log(`Utilisateur connecté : ${currentUser.username}`);
        console.log(`Nombres tirés : ${nombres.join(", ")}`);
    } else {
        console.log("Aucun utilisateur connecté.");
    }
});
*/


// Fonction pour récupérer les informations de l'utilisateur connecté
async function getCurrentUser() {
    try {
        const response = await fetch("http://localhost:3000/current-user");
        if (!response.ok) {
            throw new Error("Impossible de récupérer les informations de l'utilisateur connecté.");
        }
        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error("Erreur : ", error);
        return null;
    }
}


// Fonction pour générer 5 nombres aléatoires
function tirerNombresAleatoires(min, max) {
    const nombres = [];
    while (nombres.length < 5) {
        const nombre = Math.floor(Math.random() * (max - min + 1)) + min;
        nombres.push(nombre);
    }
    return nombres;
}







// Ajout d'un événement au clic du bouton
document.getElementById("tirer").addEventListener("click", async () => {
    const nombres = tirerNombresAleatoires(50, 55);
    // Récupérer le nom de l'utilisateur connecté (vous devez déjà avoir cette info)
    const currentUser = await getCurrentUser(); // Remplacez par la logique pour récupérer l'utilisateur connecté
    
    try {
        const response = await fetch('http://localhost:3000/add-items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: currentUser.username,
                items: nombres,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log(`Utilisateur : ${currentUser.username}`);
            console.log(`Nombres tirés : ${nombres.join(", ")}`);
            console.log(`Items mis à jour : ${result.items}`);
        } else {
            console.error("Erreur lors de l'ajout des items.");
        }
    } catch (error) {
        console.error("Erreur réseau : ", error);
    }
});
