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
    const serverListContainer = document.getElementById('server-list-container');
    const modal = document.getElementById('server-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const serverCommandEl = document.getElementById('server-command');
    const copyBtn = document.getElementById('copy-btn');

    const addServerForm = document.getElementById('add-server-form');
    const removeServerForm = document.getElementById('remove-server-form');
    const removeServerSelect = document.getElementById('remove-server-select');

    // --- Render Logic (Only runs on index.html) ---
    if (serverListContainer) {
        function renderServers() {
            serverListContainer.innerHTML = ''; // Clear current list

            servers.forEach(server => {
                const card = document.createElement('div');
                card.className = 'server-card';

                const badgeClass = server.status === 'aktiv' ? 'aktiv' : 'inaktiv';
                const badgeText = server.status === 'aktiv' ? 'AKTIV' : 'INAKTIV';

                // Just some varied icons
                let iconHtml = `<div class="card-icon placeholder-icon">?</div>`;
                if (server.name.toLowerCase().includes('test')) {
                    iconHtml = `<div class="card-icon mc-icon"><img src="https://minotar.net/helm/Steve/48.png" alt="Icon" /></div>`;
                } else if (server.name.toLowerCase() !== 'ny server') {
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
                    if (serverCommandEl && modal) {
                        serverCommandEl.innerText = `/server ${server.name}`;
                        modal.classList.remove('hidden');
                    }

                    // Visual feedback on click
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
    }

    // --- Modal Logic (Only runs on index.html) ---
    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Close on click outside modal content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    if (copyBtn && serverCommandEl) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(serverCommandEl.innerText).then(() => {
                const originalText = copyBtn.innerText;
                copyBtn.innerText = 'Kopieret!';
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                }, 2000);
            });
        });
    }

    // --- Admin Form Logic (Only runs on admin.html) ---
    if (removeServerForm && removeServerSelect) {
        function updateRemoveOptions() {
            removeServerSelect.innerHTML = '<option value="" disabled selected>-- Vælg en server --</option>';
            servers.forEach((server, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${server.name} (${server.status})`;
                removeServerSelect.appendChild(option);
            });
        }
        updateRemoveOptions();

        removeServerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedIndex = removeServerSelect.value;
            if (selectedIndex !== "") {
                const serverName = servers[selectedIndex].name;
                if (confirm(`Er du sikker på at du vil fjerne serveren "${serverName}"?`)) {
                    servers.splice(selectedIndex, 1);
                    localStorage.setItem('mc_servers', JSON.stringify(servers));
                    updateRemoveOptions();
                }
            }
        });
    }

    if (addServerForm) {
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

            // Redirect automatically to home
            window.location.href = 'index.html';
        });
    }
});
