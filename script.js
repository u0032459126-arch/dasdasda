// Hent gemt countdown dato
let countdownDate = localStorage.getItem("countdownDate");

// Hvis der ikke findes en gemt dato, opret en ny (7 dage fra nu)
if (!countdownDate) {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    countdownDate = date.getTime();
    localStorage.setItem("countdownDate", countdownDate);
}

// Konverter til number
countdownDate = Number(countdownDate);

function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    // Tidsberegninger
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Opdater HTML
    document.getElementById("days").innerText = days.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

    // Hvis tiden er udløbet
    if (distance < 0) {
        clearInterval(timer);
        document.querySelector(".countdown-timer").innerHTML =
            "<h2 style='color: var(--neon-cyan); text-shadow: 0 0 10px var(--neon-cyan);'>SERVEREN ER ÅBEN!</h2>";
    }
}

// Opdater hvert sekund
const timer = setInterval(updateCountdown, 1000);

// Kør med det samme
updateCountdown();
