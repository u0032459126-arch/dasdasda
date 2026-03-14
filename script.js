document.addEventListener('DOMContentLoaded', () => {
    // Add simple hover or click interactions
    const cards = document.querySelectorAll('.server-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const serverName = card.querySelector('.server-name').innerText;
            const statusBadge = card.querySelector('.badge');
            const isActive = statusBadge.classList.contains('aktiv');

            console.log(`Clicked on ${serverName} (Active: ${isActive})`);

            // Visual feedback on click
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 100);
        });

        // Ensure cursor is pointer to indicate interactivity
        card.style.cursor = 'pointer';
    });
});
