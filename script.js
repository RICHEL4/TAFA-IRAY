if (document.getElementById("register-btn")) {
    const registerPhone = document.getElementById("register-phone");
    const registerCode = document.getElementById("register-code");
    const registerBtn = document.getElementById("register-btn");
    const registerMessage = document.getElementById("register-message");
    const loginPhone = document.getElementById("login-phone");
    const loginBtn = document.getElementById("login-btn");
    const loginMessage = document.getElementById("login-message");
    const registerSection = document.getElementById("register-section");
    const loginSection = document.getElementById("login-section");
    const switchToLogin = document.getElementById("switch-to-login");
    const switchToRegister = document.getElementById("switch-to-register");

    const activationCode = "TAFAIRAY1210";

    function validatePhoneNumber(phone) {
        const regex = /^\+261\s?(3[2-4]|[2-9])\s?\d{7}$/;
        return regex.test(phone);
    }

    registerBtn.addEventListener("click", () => {
        const phone = registerPhone.value.trim();
        const code = registerCode.value.trim();

        if (!validatePhoneNumber(phone)) {
            registerMessage.textContent = "Numéro invalide. Format : +261 XX XXX XXXX";
            registerMessage.style.color = "#fff";
            return;
        }

        if (code !== activationCode) {
            registerMessage.textContent = "Code d'activation incorrect.";
            registerMessage.style.color = "#fff";
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.includes(phone)) {
            registerMessage.textContent = "Ce numéro est déjà inscrit.";
            registerMessage.style.color = "#fff";
        } else {
            users.push(phone);
            localStorage.setItem("users", JSON.stringify(users));
            registerMessage.textContent = "Inscription réussie ! Connectez-vous.";
            registerMessage.style.color = "#ff6347";
            registerPhone.value = "";
            registerCode.value = "";
        }
    });

    loginBtn.addEventListener("click", () => {
        const phone = loginPhone.value.trim();
        const users = JSON.parse(localStorage.getItem("users")) || [];

        if (!validatePhoneNumber(phone)) {
            loginMessage.textContent = "Numéro invalide. Format : +261 XX XXX XXXX";
            loginMessage.style.color = "#fff";
            return;
        }

        if (users.includes(phone)) {
            localStorage.setItem("loggedInUser", phone);
            window.location.href = "dashboard.html";
        } else {
            loginMessage.textContent = "Numéro non inscrit. Inscrivez-vous d'abord.";
            loginMessage.style.color = "#fff";
        }
    });

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

} else if (document.getElementById("update-btn")) {
    const responseElement = document.getElementById("response");
    const highOddsElement = document.getElementById("high-odds");
    const timeInput = document.getElementById("time-input");
    const updateButton = document.getElementById("update-btn");
    const topTourList = document.getElementById("top-tour-list");
    const logoutBtn = document.getElementById("logout-btn");

    if (!localStorage.getItem("loggedInUser")) {
        window.location.href = "index.html";
    }

    let tours = [];

    function formatTimeWithoutSeconds(time) {
        const [hours, mins] = time.split(":").slice(0, 2);
        return `${hours}:${mins}`;
    }

    function addTime(time, minutes, seconds) {
        const [hours, mins, secs] = time.split(":").map(Number);
        const totalSeconds = hours * 3600 + mins * 60 + (secs || 0) + minutes * 60 + seconds;
        const newHours = Math.floor(totalSeconds / 3600) % 24;
        const newMins = Math.floor((totalSeconds % 3600) / 60);
        const newSecs = totalSeconds % 60;
        return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}:${String(newSecs).padStart(2, '0')}`;
    }

    function generatePrediction() {
        const random = Math.random();
        return random < 0.5 ? "x5" : "x10+";
    }

    function generateHighOdds() {
        const odds = ["x20", "x50", "x100"];
        return odds[Math.floor(Math.random() * odds.length)];
    }

    function updateDisplay() {
        const time = timeInput.value;
        if (!time || !/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
            alert("Veuillez entrer une heure valide au format HH:MM ou HH:MM:SS.");
            return;
        }

        const time1 = addTime(time, 3, 0);
        const time2 = addTime(time, 4, 30);

        const prediction1 = generatePrediction();
        const prediction2 = generatePrediction();

        const displayTime1 = formatTimeWithoutSeconds(time1);
        const displayTime2 = formatTimeWithoutSeconds(time2);

        responseElement.innerHTML = `
            <p>${displayTime1} - ${prediction1}</p>
            <p>${displayTime2} - ${prediction2}</p>
        `;

        if (Math.random() > 0.5) {
            const highOdds = generateHighOdds();
            highOddsElement.innerHTML = `<p>Cote élevée : ${highOdds}</p>`;
        } else {
            highOddsElement.innerHTML = `<p>Aucune cote élevée pour le moment.</p>`;
        }

        tours.push({ time: displayTime1, prediction: prediction1 });
        tours.push({ time: displayTime2, prediction: prediction2 });

        updateTopTour();
    }

    function updateTopTour() {
        const sortedTours = tours.sort((a, b) => {
            if (a.prediction === "x10+" && b.prediction !== "x10+") return -1;
            if (b.prediction === "x10+" && a.prediction !== "x10+") return 1;
            return 0;
        });

        const topTours = sortedTours.slice(0, 5);

        topTourList.innerHTML = topTours
            .map((tour) => `<li><span>${tour.time}</span> - ${tour.prediction}</li>`)
            .join("");
    }

    updateButton.addEventListener("click", updateDisplay);
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
    });
}