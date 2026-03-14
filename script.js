const DISCORD_CLIENT_ID = '1032680072500498463'; // Skriv din Discord Client ID her
const ADMIN_IDS = ['1032680072500498463']; // Skriv dit Discord User ID her (f.eks. "123456789012345678")

// Beregn redirect URI dynamisk (fallback til index.html)
let REDIRECT_URI = window.location.origin + window.location.pathname;
if (REDIRECT_URI.includes('admin.html')) {
    REDIRECT_URI = REDIRECT_URI.replace('admin.html', 'index.html');
}

// 1. Tjek for Discord Token i URL
const fragment = new URLSearchParams(window.location.hash.slice(1));
const accessToken = fragment.get('access_token');
const tokenType = fragment.get('token_type');

if (accessToken) {
    localStorage.setItem('discord_token', accessToken);
    localStorage.setItem('discord_token_type', tokenType);
    window.location.hash = ''; // Ryd URL

    // Hent bruger info
    fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenType} ${accessToken}`
        }
    })
        .then(result => result.json())
        .then(response => {
            localStorage.setItem('discord_user', JSON.stringify(response));
            window.location.reload();
        })
        .catch(console.error);
}

// 2. Auth State
const userJson = localStorage.getItem('discord_user');
let currentUser = null;
let userRank = 'Gæst';

if (userJson) {
    currentUser = JSON.parse(userJson);
    userRank = ADMIN_IDS.includes(currentUser.id) ? 'Admin' : 'Medlem';
}

const isAdminPage = window.location.pathname.includes('admin.html');

// 3. Beskyt Admin Panelet
if (isAdminPage && (!currentUser || userRank !== 'Admin')) {
    alert('Du har ikke adgang til denne side. For at få adgang skal du logge ind med Discord og have Admin rank.');
    window.location.href = 'index.html';
}

function loginWithDiscord() {
    if (DISCORD_CLIENT_ID === 'INDSÆT_DIN_CLIENT_ID_HER') {
        // Mock Login for test purposes if Client ID is not set
        const wantAdmin = confirm('Test Mode (Ingen Client ID sat):\n\nVil du logge ind som Admin? (OK = Admin, Annuller = Medlem)');
        const mockUser = {
            id: wantAdmin ? 'INDSÆT_DIT_DISCORD_ID_HER' : '123456789',
            username: wantAdmin ? 'AdminBruger' : 'NormalBruger',
            avatar: null,
            discriminator: '0000'
        };
        localStorage.setItem('discord_user', JSON.stringify(mockUser));
        window.location.reload();
        return;
    }
    const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify`;
    window.location.href = oauthUrl;
}

function logout() {
    localStorage.removeItem('discord_token');
    localStorage.removeItem('discord_token_type');
    localStorage.removeItem('discord_user');
    window.location.href = 'index.html';
}

// 4. GUI & Resten af scriptet (kører når DOM er klar)
document.addEventListener('DOMContentLoaded', () => {
    // Auth UI
    const authSection = document.getElementById('auth-section');
    const navAdminLink = document.getElementById('nav-admin-link');

    if (authSection) {
        if (currentUser) {
            if (navAdminLink && userRank === 'Admin') {
                navAdminLink.style.display = 'inline-block';
            } else if (navAdminLink) {
                navAdminLink.style.display = 'none';
            }

            let avatarUrl = currentUser.avatar
                ? `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.png`
                : `https://ui-avatars.com/api/?name=${currentUser.username}&background=random`;

            authSection.innerHTML = `
                <div class="badge-pill">
                    <img src="${avatarUrl}" alt="avatar">
                    ${currentUser.username} <span class="rank-badge ${userRank.toLowerCase()}">${userRank}</span>
                </div>
                <button class="logout-btn" id="logout-btn" title="Log ud">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                </button>
            `;
            document.getElementById('logout-btn').addEventListener('click', logout);
        } else {
            if (navAdminLink) {
                navAdminLink.style.display = 'none';
            }
            authSection.innerHTML = `
                <button id="login-discord-btn" class="discord-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
                        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77.7,77.7,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96,46,95.89,53,91,65.69,84.69,65.69Z"/>
                    </svg>
                    Login med Discord
                </button>
            `;
            document.getElementById('login-discord-btn').addEventListener('click', loginWithDiscord);
        }
    }

    // Server list og Modals
    let servers = [
        { name: "Ny Server", desc: "Beskrivelse her...", status: "inaktiv" },
        { name: "Test server", desc: "asdsadsads", status: "aktiv" }
    ];

    const storedServers = localStorage.getItem('mc_servers');
    if (storedServers) {
        servers = JSON.parse(storedServers);
    } else {
        localStorage.setItem('mc_servers', JSON.stringify(servers));
    }

    const serverListContainer = document.getElementById('server-list-container');
    const modal = document.getElementById('server-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const serverCommandEl = document.getElementById('server-command');
    const copyBtn = document.getElementById('copy-btn');
    const addServerForm = document.getElementById('add-server-form');

    if (serverListContainer) {
        function renderServers() {
            serverListContainer.innerHTML = '';
            servers.forEach(server => {
                const card = document.createElement('div');
                card.className = 'server-card';

                const badgeClass = server.status === 'aktiv' ? 'aktiv' : 'inaktiv';
                const badgeText = server.status === 'aktiv' ? 'AKTIV' : 'INAKTIV';

                let iconHtml = \`<div class="card-icon placeholder-icon">?</div>\`;
                if (server.name.toLowerCase().includes('test')) {
                    iconHtml = \`<div class="card-icon mc-icon"><img src="https://minotar.net/helm/Steve/48.png" alt="Icon" /></div>\`;
                } else if (server.name.toLowerCase() !== 'ny server') {
                    iconHtml = \`<div class="card-icon mc-icon"><img src="https://minotar.net/helm/\${encodeURIComponent(server.name)}/48.png" alt="Icon" onerror="this.src='https://minotar.net/helm/Steve/48.png'" /></div>\`;
                }

                card.innerHTML = \`
                    <div class="card-info">
                        <div class="card-header">
                            <h3 class="server-name">\${server.name}</h3>
                            <span class="badge \${badgeClass}"><span class="dot"></span> \${badgeText}</span>
                        </div>
                        <p class="server-desc">\${server.desc}</p>
                    </div>
                    \${iconHtml}
                \`;

                card.addEventListener('click', () => {
                    if (serverCommandEl && modal) {
                        serverCommandEl.innerText = \`/server \${server.name}\`;
                        modal.classList.remove('hidden');
                    }
                    card.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        card.style.transform = '';
                    }, 100);
                });
                
                card.style.cursor = 'pointer';
                serverListContainer.appendChild(card);
            });
        }
        renderServers();
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
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

    if (addServerForm) {
        addServerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('server-name-input').value;
            const descInput = document.getElementById('server-desc-input').value;
            const statusInput = document.getElementById('server-status-input').value;

            const newServer = {
                name: nameInput,
                desc: descInput,
                status: statusInput
            };
            
            servers.push(newServer);
            localStorage.setItem('mc_servers', JSON.stringify(servers));
            window.location.href = 'index.html';
        });
    }
});
