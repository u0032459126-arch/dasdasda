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

    // --- Marketplace Logic (Only runs on marketplace.html) ---
    const marketplaceListContainer = document.getElementById('marketplace-list-container');
    const buyModal = document.getElementById('buy-modal');
    const closeBuyModalBtn = document.querySelector('.close-buy-modal');
    const buyForm = document.getElementById('buy-form');

    // Fake marketplace items that admin normally would add, but hardcoded for now
    const marketItems = [
        { name: "Boxing Simulator Filer (MAP)", desc: "Komplet Boxing server med custom Skripts, opsat rank system og map.", dkk: 50, ems: 500.000 },
        { name: "Prison Core", desc: "A-Z miner klar. Inkluderer prestige system og custom pickaxe scripts.", dkk: 250, ems: 5000 },
        { name: "Lobby Hub", desc: "Lille flot lobby med plads til 4 NPC'er, server selector og parkour.", dkk: 50, ems: 1000 }
    ];

    if (marketplaceListContainer) {
        function renderMarketplace() {
            marketplaceListContainer.innerHTML = '';

            marketItems.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'server-card marketplace-card';

                card.innerHTML = `
                    <div class="card-info" style="width: 100%;">
                        <div class="card-header" style="justify-content: space-between; width: 100%;">
                            <h3 class="server-name">${item.name}</h3>
                            <div class="card-icon placeholder-icon" style="width: 32px; height: 32px; font-size: 14px;">📦</div>
                        </div>
                        <p class="server-desc" style="margin-top: 4px;">${item.desc}</p>
                        
                        <div class="marketplace-price">
                            <span class="price-tag">
                                💵 ${item.dkk} DKK 
                                <span style="color:#9ca3af; font-size:12px; font-weight:400;">/</span>
                                <img src="https://minecraft.wiki/images/Emerald_JE3_BE3.png" style="width: 14px; height: 14px; image-rendering: pixelated; margin-left: 2px;"> ${item.ems}
                            </span>
                            <button class="buy-btn" data-index="${index}">Køb Nu</button>
                        </div>
                    </div>
                `;
                marketplaceListContainer.appendChild(card);
            });

            // Open Modal on click
            document.querySelectorAll('.buy-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = e.target.getAttribute('data-index');
                    const item = marketItems[index];

                    document.getElementById('buy-server-name').innerText = item.name;
                    document.getElementById('internal-dkk-price').value = item.dkk;
                    document.getElementById('internal-ems-price').value = item.ems;

                    // Reset to DKK by default on open
                    document.getElementById('pay-dkk').checked = true;
                    updatePriceDisplay();

                    buyModal.classList.remove('hidden');
                });
            });
        }

        renderMarketplace();

        // Handle Price display toggle
        const updatePriceDisplay = () => {
            const isDkk = document.getElementById('pay-dkk').checked;
            const dkkVal = document.getElementById('internal-dkk-price').value;
            const emsVal = document.getElementById('internal-ems-price').value;

            if (isDkk) {
                document.getElementById('buy-price-display').innerHTML = `💵 ${dkkVal} DKK`;
            } else {
                document.getElementById('buy-price-display').innerHTML = `<img src="https://minecraft.wiki/images/Emerald_JE3_BE3.png" style="width: 18px; margin-right: 4px; image-rendering: pixelated;"> ${emsVal} EMS`;
            }
        };

        const radioBtns = document.querySelectorAll('input[name="payment_method"]');
        radioBtns.forEach(radio => radio.addEventListener('change', updatePriceDisplay));

        // Submit via mailto
        buyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const buyer = document.getElementById('buyer-name').value;
            const serverName = document.getElementById('buy-server-name').innerText;
            const isDkk = document.getElementById('pay-dkk').checked;
            const price = isDkk ? document.getElementById('internal-dkk-price').value + ' DKK' : document.getElementById('internal-ems-price').value + ' Emeralds';

            // Sæt et display-navn på e-mailen ("MC ServerList <u0032459126@gmail.com>")
            const adminEmail = "MC ServerList %3Cu0032459126@gmail.com%3E";
            const subject = encodeURIComponent(`Købsanmodning: ${serverName}`);
            const body = encodeURIComponent(`Hej Admin,\n\nJeg vil gerne købe serveren/setup: "${serverName}".\nMit Minecraft/Discord navn er: ${buyer}\nJeg ønsker at betale med: ${price}\n\nKontakt mig venligst for at færdiggøre handlen.\n\nVenlig hilsen,\n${buyer}`);

            window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;

            buyModal.classList.add('hidden');
            buyForm.reset();
        });

        // Modal close
        closeBuyModalBtn.addEventListener('click', () => {
            buyModal.classList.add('hidden');
        });

        buyModal.addEventListener('click', (e) => {
            if (e.target === buyModal) {
                buyModal.classList.add('hidden');
            }
        });
    }
});
