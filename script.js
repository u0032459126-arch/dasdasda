document.addEventListener('DOMContentLoaded', () => {
    // Standard data / Initial servers
    let servers = [
        { name: "Ny Server", desc: "Beskrivelse her...", status: "inaktiv" },
        { name: "Test server", desc: "asdsadsads", status: "aktiv" }
    ];

    // Check if we have servers in localStorage
    const storedServers = localStorage.getItem('mc_servers');
    if (storedServers) {
        servers = JSON.parse(storedServers);
    } else {
        localStorage.setItem('mc_servers', JSON.stringify(servers));
    }

    // DOM Elements
    const homeView = document.getElementById('home-view');
    const adminView = document.getElementById('admin-view');
    const navHome = document.getElementById('nav-home');
    const navAdmin = document.getElementById('nav-admin');
    
    const serverListContainer = document.getElementById('server-list-container');
    
    const modal = document.getElementById('server-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const serverCommandEl = document.getElementById('server-command');
    const copyBtn = document.getElementById('copy-btn');
    
    const addServerForm = document.getElementById('add-server-form');

    // --- Navigation Logic ---
    navHome.addEventListener('click', (e) => {
        e.preventDefault();
        homeView.classList.remove('hidden');
        adminView.classList.add('hidden');
    });

    navAdmin.addEventListener('click', (e) => {
        e.preventDefault();
        adminView.classList.remove('hidden');
        homeView.classList.add('hidden');
    });

    // --- Render Logic ---
    function renderServers() {
        serverListContainer.innerHTML = ''; // Clear current list

        servers.forEach(server => {
            const card = document.createElement('div');
            card.className = 'server-card';
            
            const badgeClass = server.status === 'aktiv' ? 'aktiv' : 'inaktiv';
            const badgeText = server.status === 'aktiv' ? 'AKTIV' : 'INAKTIV';
            
            // Just some varied icons (Test server gets a specific face, others get placeholder or random face)
            let iconHtml = `<div class="card-icon placeholder-icon">?</div>`;
            if (server.name.toLowerCase().includes('test')) {
                iconHtml = `<div class="card-icon mc-icon"><img src="https://minotar.net/helm/Steve/48.png" alt="Icon" /></div>`;
            } else if (server.name.toLowerCase() !== 'ny server') {
                // Random face based on name for new servers
                iconHtml = `<div class="card-icon mc-icon"><img src="https://minotar.net/helm/${encodeURIComponent(server.name)}/48.png" alt="Icon" onerror="this.src='https://minotar.net/helm/Steve/48.png'" /></div>`;
            }

            card.innerHTML = `
                <div class="card-info">
                    <div class="card-header">
                        <h3 class="server-name">${server.name}</h3>
                        <span class="badge ${badgeClass}"><span class="dot"></span> ${badgeText}</span>
                    </div>
                    <p class="server-desc">${server.desc}</p>
                </div>
                ${iconHtml}
            `;

            // Server click -> Open modal
            card.addEventListener('click', () => {
                serverCommandEl.innerText = `/server ${server.name}`;
                modal.classList.remove('hidden');
                
                // Visual feedback on open
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 100);
            });
            
            card.style.cursor = 'pointer';

            serverListContainer.appendChild(card);
        });
    }

    // Initial render
    renderServers();

    // --- Modal Logic ---
    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Close on click outside modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Copy Button logic
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(serverCommandEl.innerText).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = 'Kopieret!';
            setTimeout(() => {
                copyBtn.innerText = originalText;
            }, 2000);
        });
    });

    // --- Admin Form Logic ---
    addServerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('server-name-input').value;
        const descInput = document.getElementById('server-desc-input').value;
        const statusInput = document.getElementById('server-status-input').value;

        // Add new server to array
        const newServer = {
            name: nameInput,
            desc: descInput,
            status: statusInput
        };
        
        servers.push(newServer);
        
        // Save to localStorage
        localStorage.setItem('mc_servers', JSON.stringify(servers));

        // Re-render
        renderServers();

        // Reset and go back
        addServerForm.reset();
        navHome.click(); // Switch to home view automatically
    });
});
