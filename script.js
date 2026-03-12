// Sæt datoen vi tæller ned til (f.eks. om 7 dage)
const countdownDate = new Date();
countdownDate.setDate(countdownDate.getDate() + 7); // Standard: 7 dage fra nu

function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    // Tidsberegninger for dage, timer, minutter og sekunder
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Vis resultatet i de respektive elementer
    document.getElementById("days").innerText = days.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

    // Hvis nedtællingen er slut
    if (distance < 0) {
        clearInterval(x);
        document.querySelector(".countdown-timer").innerHTML = "<h2 style='color: var(--neon-cyan); text-shadow: 0 0 10px var(--neon-cyan);'>SERVEREN ER ÅBEN!</h2>";
    }
}

// Opdater nedtællingen hvert sekund
const x = setInterval(updateCountdown, 1000);

// Kør funktionen med det samme så vi ikke venter 1 sekund på første update
updateCountdown();
