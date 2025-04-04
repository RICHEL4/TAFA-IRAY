// Vérification de la connexion
if (!localStorage.getItem("loggedInUser")) {
    window.location.href = "index.html";
}

function calculate() {
    const timeInput = document.getElementById('timeInput').value.trim();
    if (!timeInput.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
        alert("Format d'heure invalide. Utilisez HH:MM (ex: 15:38)");
        return;
    }
    
    const [hours, minutes] = timeInput.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    // Calcul du décalage de 3 minutes
    const newDate = new Date(date.getTime() + 3*60000);
    const newTime = formatTime(newDate);
    
    // Génération aléatoire du multiplicateur (X3 à X5)
    const multiplier = Math.floor(Math.random() * 13) + 3; // 3-5
    const multiplierText = 'X' + multiplier;
    
    // Génération aléatoire du niveau de risque (1-100)
    const riskLevel = Math.floor(Math.random() * 100) + 1;
    let riskText = riskLevel.toString();
    if (riskLevel >= 100) riskText += ' (DANGER MAXIMUM)';
    else if (riskLevel >= 7) riskText += ' (HAUT RISQUE)';
    else if (riskLevel >= 4) riskText += ' (RISQUE MODÉRÉ)';
    else riskText += ' (FAIBLE RISQUE)';
    
    // Affichage des résultats
    document.querySelector('.time').textContent = newTime;
    document.querySelector('.multiplier').textContent = multiplierText;
    document.querySelector('.risk-level').textContent = riskText;
    
    // Changement de couleur en fonction du risque
    const riskElement = document.querySelector('.risk-level');
    if (riskLevel >= 100) {
        riskElement.style.color = '#ff0000';
        riskElement.style.textShadow = '0 0 15px #ff0000';
    } else if (riskLevel >= 7) {
        riskElement.style.color = '#ff5555';
        riskElement.style.textShadow = '0 0 10px #ff5555';
    } else {
        riskElement.style.color = '#ff9955';
        riskElement.style.textShadow = '0 0 5px #ff9955';
    }
}

function useCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('timeInput').value = `${hours}:${minutes}`;
}

function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}