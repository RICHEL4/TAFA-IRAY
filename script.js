// Éléments du DOM pour l'authentification
const authContainer = document.getElementById("auth-container");
const mainContainer = document.getElementById("main-container");
const registerSection = document.getElementById("register-section");
const loginSection = document.getElementById("login-section");
const usernameInput = document.getElementById("username-input");
const activationCodeInput = document.getElementById("activation-code-input");
const loginCodeInput = document.getElementById("login-code-input");
const registerBtn = document.getElementById("register-btn");
const loginBtn = document.getElementById("login-btn");
const switchToLogin = document.getElementById("switch-to-login");
const switchToRegister = document.getElementById("switch-to-register");
const userNameDisplay = document.getElementById("user-name-display");
const logoutBtn = document.getElementById("logout-btn");

// Éléments du DOM pour la fonctionnalité principale
const responseElement = document.getElementById("response");
const highOddsElement = document.getElementById("high-odds");
const timeInput = document.getElementById("time-input");
const updateButton = document.getElementById("update-btn");
const topTourList = document.getElementById("top-tour-list");

// Tableau pour stocker les tours
let tours = [];

// Vérifier si un utilisateur est déjà connecté
function checkLoggedInUser() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        userNameDisplay.textContent = user.username;
        authContainer.style.display = "none";
        mainContainer.style.display = "block";
    } else {
        authContainer.style.display = "block";
        mainContainer.style.display = "none";
    }
}

// Gestion de l'inscription
registerBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const activationCode = activationCodeInput.value.trim();

    if (!username || !activationCode) {
        alert("Veuillez entrer un nom et un code d'activation.");
        return;
    }

    // Vérifier si le code d'activation existe déjà
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(user => user.activationCode === activationCode)) {
        alert("Ce code d'activation est déjà utilisé.");
        return;
    }

    // Ajouter l'utilisateur
    users.push({ username, activationCode });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Inscription réussie ! Veuillez vous connecter.");
    registerSection.style.display = "none";
    loginSection.style.display = "block";
});

// Gestion de la connexion
loginBtn.addEventListener("click", () => {
    const activationCode = loginCodeInput.value.trim();

    if (!activationCode) {
        alert("Veuillez entrer un code d'activation.");
        return;
    }

    // Vérifier si le code d'activation existe
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.activationCode === activationCode);

    if (!user) {
        alert("Code d'activation incorrect.");
        return;
    }

    // Connecter l'utilisateur
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    userNameDisplay.textContent = user.username;
    authContainer.style.display = "none";
    mainContainer.style.display = "block";
});

// Gestion de la déconnexion
logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedInUser");
    authContainer.style.display = "block";
    mainContainer.style.display = "none";
    loginSection.style.display = "block";
    registerSection.style.display = "none";
});

// Basculer entre inscription et connexion
switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerSection.style.display = "none";
    loginSection.style.display = "block";
});

switchToRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginSection.style.display = "none";
    registerSection.style.display = "block";
});

// Vérifier l'état de connexion au chargement de la page
checkLoggedInUser();

// Fonction pour formater l'heure sans secondes
function formatTimeWithoutSeconds(time) {
    const [hours, mins] = time.split(":").slice(0, 2);
    return `${hours}:${mins}`;
}

// Fonction pour ajouter des minutes et des secondes à une heure
function addTime(time, minutes, seconds) {
    const [hours, mins, secs] = time.split(":").map(Number);
    const totalSeconds = hours * 3600 + mins * 60 + (secs || 0) + minutes * 60 + seconds;
    const newHours = Math.floor(totalSeconds / 3600) % 24;
    const newMins = Math.floor((totalSeconds % 3600) / 60);
    const newSecs = totalSeconds % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}:${String(newSecs).padStart(2, '0')}`;
}

// Fonction pour générer une prédiction
function generatePrediction() {
    const random = Math.random();
    return random < 0.5 ? "x5" : "x10+";
}

// Fonction pour générer une cote élevée
function generateHighOdds() {
    const odds = ["x20", "x50", "x100"];
    return odds[Math.floor(Math.random() * odds.length)];
}

// Mettre à jour la réponse avec les heures décalées
function updateDisplay() {
    const time = timeInput.value;
    if (!time || !/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
        alert("Veuillez entrer une heure valide au format HH:MM ou HH:MM:SS.");
        return;
    }

    const time1 = addTime(time, 3, 0); // Ajoute 3 minutes
    const time2 = addTime(time, 4, 30); // Ajoute 4 minutes et 30 secondes

    const prediction1 = generatePrediction();
    const prediction2 = generatePrediction();

    // Formater les heures sans secondes pour l'affichage
    const displayTime1 = formatTimeWithoutSeconds(time1);
    const displayTime2 = formatTimeWithoutSeconds(time2);

    responseElement.innerHTML = `
        <p>${displayTime1} - ${prediction1}</p>
        <p>${displayTime2} - ${prediction2}</p>
    `;

    // Vérifier si la cote est supérieure à 50
    if (Math.random() > 0.5) { // Simuler une cote élevée
        const highOdds = generateHighOdds();
        highOddsElement.innerHTML = `
            <p>Cote élevée : ${highOdds}</p>
        `;
    } else {
        highOddsElement.innerHTML = `<p>Aucune cote élevée pour le moment.</p>`;
    }

    // Ajouter les tours au tableau (avec l'heure formatée sans secondes)
    tours.push({ time: displayTime1, prediction: prediction1 });
    tours.push({ time: displayTime2, prediction: prediction2 });

    // Mettre à jour le Top Tour
    updateTopTour();
}

// Mettre à jour la section Top Tour
function updateTopTour() {
    // Trier les tours par prédiction (x10+ en premier)
    const sortedTours = tours.sort((a, b) => {
        if (a.prediction === "x10+" && b.prediction !== "x10+") return -1;
        if (b.prediction === "x10+" && a.prediction !== "x10+") return 1;
        return 0;
    });

    // Limiter à 5 tours maximum
    const topTours = sortedTours.slice(0, 5);

    // Mettre à jour l'affichage
    topTourList.innerHTML = topTours
        .map((tour) => `<li><span>${tour.time}</span> - ${tour.prediction}</li>`)
        .join("");
}

// Événement pour le bouton
updateButton.addEventListener("click", updateDisplay);

// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('data:application/javascript;base64,' + btoa(`
        self.addEventListener('install', (event) => {
            console.log('Service Worker installé');
        });

        self.addEventListener('fetch', (event) => {
            console.log('Requête interceptée :', event.request.url);
        });
    `))
        .then(() => console.log('Service Worker enregistré'))
        .catch((err) => console.log('Échec de l\'enregistrement du Service Worker :', err));
}// Éléments du DOM pour l'authentification
const authContainer = document.getElementById("auth-container");
const mainContainer = document.getElementById("main-container");
const registerSection = document.getElementById("register-section");
const loginSection = document.getElementById("login-section");
const usernameInput = document.getElementById("username-input");
const activationCodeInput = document.getElementById("activation-code-input");
const loginCodeInput = document.getElementById("login-code-input");
const registerBtn = document.getElementById("register-btn");
const loginBtn = document.getElementById("login-btn");
const switchToLogin = document.getElementById("switch-to-login");
const switchToRegister = document.getElementById("switch-to-register");
const userNameDisplay = document.getElementById("user-name-display");
const logoutBtn = document.getElementById("logout-btn");

// Éléments du DOM pour la fonctionnalité principale
const responseElement = document.getElementById("response");
const highOddsElement = document.getElementById("high-odds");
const timeInput = document.getElementById("time-input");
const updateButton = document.getElementById("update-btn");
const topTourList = document.getElementById("top-tour-list");

// Tableau pour stocker les tours
let tours = [];

// Vérifier si un utilisateur est déjà connecté
function checkLoggedInUser() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        userNameDisplay.textContent = user.username;
        authContainer.style.display = "none";
        mainContainer.style.display = "block";
    } else {
        authContainer.style.display = "block";
        mainContainer.style.display = "none";
    }
}

// Gestion de l'inscription
registerBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const activationCode = activationCodeInput.value.trim();

    if (!username || !activationCode) {
        alert("Veuillez entrer un nom et un code d'activation.");
        return;
    }

    // Vérifier si le code d'activation existe déjà
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(user => user.activationCode === activationCode)) {
        alert("Ce code d'activation est déjà utilisé.");
        return;
    }

    // Ajouter l'utilisateur
    users.push({ username, activationCode });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Inscription réussie ! Veuillez vous connecter.");
    registerSection.style.display = "none";
    loginSection.style.display = "block";
});

// Gestion de la connexion
loginBtn.addEventListener("click", () => {
    const activationCode = loginCodeInput.value.trim();

    if (!activationCode) {
        alert("Veuillez entrer un code d'activation.");
        return;
    }

    // Vérifier si le code d'activation existe
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.activationCode === activationCode);

    if (!user) {
        alert("Code d'activation incorrect.");
        return;
    }

    // Connecter l'utilisateur
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    userNameDisplay.textContent = user.username;
    authContainer.style.display = "none";
    mainContainer.style.display = "block";
});

// Gestion de la déconnexion
logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedInUser");
    authContainer.style.display = "block";
    mainContainer.style.display = "none";
    loginSection.style.display = "block";
    registerSection.style.display = "none";
});

// Basculer entre inscription et connexion
switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerSection.style.display = "none";
    loginSection.style.display = "block";
});

switchToRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginSection.style.display = "none";
    registerSection.style.display = "block";
});

// Vérifier l'état de connexion au chargement de la page
checkLoggedInUser();

// Fonction pour formater l'heure sans secondes
function formatTimeWithoutSeconds(time) {
    const [hours, mins] = time.split(":").slice(0, 2);
    return `${hours}:${mins}`;
}

// Fonction pour ajouter des minutes et des secondes à une heure
function addTime(time, minutes, seconds) {
    const [hours, mins, secs] = time.split(":").map(Number);
    const totalSeconds = hours * 3600 + mins * 60 + (secs || 0) + minutes * 60 + seconds;
    const newHours = Math.floor(totalSeconds / 3600) % 24;
    const newMins = Math.floor((totalSeconds % 3600) / 60);
    const newSecs = totalSeconds % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}:${String(newSecs).padStart(2, '0')}`;
}

// Fonction pour générer une prédiction
function generatePrediction() {
    const random = Math.random();
    return random < 0.5 ? "x5" : "x10+";
}

// Fonction pour générer une cote élevée
function generateHighOdds() {
    const odds = ["x20", "x50", "x100"];
    return odds[Math.floor(Math.random() * odds.length)];
}

// Mettre à jour la réponse avec les heures décalées
function updateDisplay() {
    const time = timeInput.value;
    if (!time || !/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
        alert("Veuillez entrer une heure valide au format HH:MM ou HH:MM:SS.");
        return;
    }

    const time1 = addTime(time, 3, 0); // Ajoute 3 minutes
    const time2 = addTime(time, 4, 30); // Ajoute 4 minutes et 30 secondes

    const prediction1 = generatePrediction();
    const prediction2 = generatePrediction();

    // Formater les heures sans secondes pour l'affichage
    const displayTime1 = formatTimeWithoutSeconds(time1);
    const displayTime2 = formatTimeWithoutSeconds(time2);

    responseElement.innerHTML = `
        <p>${displayTime1} - ${prediction1}</p>
        <p>${displayTime2} - ${prediction2}</p>
    `;

    // Vérifier si la cote est supérieure à 50
    if (Math.random() > 0.5) { // Simuler une cote élevée
        const highOdds = generateHighOdds();
        highOddsElement.innerHTML = `
            <p>Cote élevée : ${highOdds}</p>
        `;
    } else {
        highOddsElement.innerHTML = `<p>Aucune cote élevée pour le moment.</p>`;
    }

    // Ajouter les tours au tableau (avec l'heure formatée sans secondes)
    tours.push({ time: displayTime1, prediction: prediction1 });
    tours.push({ time: displayTime2, prediction: prediction2 });

    // Mettre à jour le Top Tour
    updateTopTour();
}

// Mettre à jour la section Top Tour
function updateTopTour() {
    // Trier les tours par prédiction (x10+ en premier)
    const sortedTours = tours.sort((a, b) => {
        if (a.prediction === "x10+" && b.prediction !== "x10+") return -1;
        if (b.prediction === "x10+" && a.prediction !== "x10+") return 1;
        return 0;
    });

    // Limiter à 5 tours maximum
    const topTours = sortedTours.slice(0, 5);

    // Mettre à jour l'affichage
    topTourList.innerHTML = topTours
        .map((tour) => `<li><span>${tour.time}</span> - ${tour.prediction}</li>`)
        .join("");
}

// Événement pour le bouton
updateButton.addEventListener("click", updateDisplay);

// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('data:application/javascript;base64,' + btoa(`
        self.addEventListener('install', (event) => {
            console.log('Service Worker installé');
        });

        self.addEventListener('fetch', (event) => {
            console.log('Requête interceptée :', event.request.url);
        });
    `))
        .then(() => console.log('Service Worker enregistré'))
        .catch((err) => console.log('Échec de l\'enregistrement du Service Worker :', err));
            }
