// Dashboard JavaScript - App Launcher with Popup Windows and Search

document.addEventListener('DOMContentLoaded', async function() {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    // Check if user is logged in
    if (!token || !username) {
        window.location.href = 'signup.html';
        return;
    }

    // Display username
    document.getElementById('username').textContent = `Welcome, ${username}!`;

    // Show admin button if user is Anton
    if (username === 'Anton') {
        document.getElementById('adminBtn').style.display = 'block';
    }

    // Fetch user data to get current premium status
    async function checkPremiumStatus() {
        try {
            const response = await fetch('/api/user/status', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response) return localStorage.getItem('isPremium') === 'true';
            const text = await response.text();
            if (!text) return localStorage.getItem('isPremium') === 'true';
            try {
                const data = JSON.parse(text);
                return !!data.isPremium;
            } catch (e) {
                return localStorage.getItem('isPremium') === 'true';
            }
        } catch (e) {
            console.error('checkPremiumStatus error', e);
            return localStorage.getItem('isPremium') === 'true';
        }
    }

    async function updateAppAccess() {
        const isPremium = await checkPremiumStatus();
        localStorage.setItem('isPremium', isPremium);

        // Update locked cards visually
        document.querySelectorAll('.app-card').forEach(card => {
            if (card.classList.contains('locked')) {
                const status = card.querySelector('.app-status');
                const btn = card.querySelector('.btn-app');
                if (isPremium) {
                    card.classList.remove('locked');
                    if (status) status.textContent = 'Unlocked';
                    if (btn) {
                        btn.disabled = false;
                        btn.textContent = 'Launch';
                    }
                } else {
                    if (status) status.textContent = '🔒 Premium Only';
                    if (btn) {
                        btn.disabled = true;
                        btn.textContent = 'Locked';
                    }
                }
            }
        });

        // Render search card (inserts next to app cards)
        renderSearchCard(!isPremium);
    }

    // Basic button handlers
    document.getElementById('adminBtn').addEventListener('click', () => window.location.href = 'admin.html');
    document.getElementById('premiumBtn').addEventListener('click', () => window.location.href = 'premium.html');
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'signup.html';
    });

    // Insert a search card at the start of the apps grid
    function renderSearchCard(isLocked) {
        const appsGrid = document.querySelector('.apps-grid');
        if (!appsGrid) return;
        if (document.getElementById('searchCard')) {
            const note = document.querySelector('#searchCard .app-status');
            if (note) note.textContent = isLocked ? 'Other apps are available only for Premium users. Upgrade to unlock them.' : 'Use the search box to find sites';
            return;
        }

        const div = document.createElement('div');
        div.className = 'app-card';
        div.id = 'searchCard';
        div.style.cssText = 'display:flex;align-items:center;justify-content:center;flex-direction:column;padding:24px;min-width:260px;';
        div.innerHTML = `
            <div class="app-icon" style="font-size:40px">🔎</div>
            <h3>Google Search</h3>
            <p class="app-status">${isLocked ? 'Other apps are available only for Premium users. Upgrade to unlock them.' : 'Use the search box to find sites'}</p>
            <div style="display:flex;gap:8px;margin-top:8px;">
                <button id="openSearchBtn" class="btn-app" style="padding:8px 12px;border-radius:6px;">Open Search</button>
                <button id="goToPremiumBtn" class="btn-premium" style="padding:8px 12px;border-radius:6px;">Get Premium</button>
            </div>
        `;

        appsGrid.insertBefore(div, appsGrid.firstChild);

        document.getElementById('openSearchBtn').addEventListener('click', () => {
            const opened = openSearchPopupWindow();
            if (!opened) createSearchModal();
        });
        document.getElementById('goToPremiumBtn').addEventListener('click', () => window.location.href = 'premium.html');

        // Attach app button handlers after inserting search card
        attachAppButtons();
    }

    // Map of app URLs
    const APP_URLS = {
        chatgpt: 'https://chat.openai.com/',
        geforce: 'https://play.geforcenow.com/mall/#/layout/games',
        tiktok: 'https://www.tiktok.com/',
        instagram: 'https://www.instagram.com/',
        snapchat: 'https://www.snapchat.com/',
        discord: 'https://discord.com/',
        twitch: 'https://www.twitch.tv/',
        youtube: 'https://www.youtube.com/',
        roblox: 'https://www.roblox.com/',
        minecraft: 'https://www.minecraft.net/',
        fortnite: 'https://www.fortnite.com/',
        valorant: 'https://valorant.com/',
        twitter: 'https://twitter.com/',
        reddit: 'https://www.reddit.com/',
        spotify: 'https://www.spotify.com/',
        netflix: 'https://www.netflix.com/',
        steam: 'https://www.steampowered.com/',
        epicgames: 'https://www.epicgames.com/',
        'discord-nitro': 'https://discord.com/nitro',
        'among-us': 'https://www.innersloth.com/games/among-us/',
        pinterest: 'https://www.pinterest.com/',
        wattpad: 'https://www.wattpad.com/',
        deviantart: 'https://www.deviantart.com/'
    };

    // Attach click handlers for all .btn-app elements
    function attachAppButtons() {
        document.querySelectorAll('.btn-app').forEach(btn => {
            // Avoid double attach
            if (btn.dataset._attached === '1') return;
            btn.dataset._attached = '1';

            btn.addEventListener('click', function() {
                const card = this.closest('.app-card');
                const app = card && card.dataset && card.dataset.app;
                const isLocked = card && card.classList.contains('locked');

                if (isLocked) {
                    alert('This app requires premium access. Contact the admin for premium upgrade.');
                    return;
                }

                const redirectUrl = APP_URLS[app];
                if (!redirectUrl) return;

                const opened = openAppPopup(redirectUrl, app);
                if (!opened) showPopupBlockedModal(redirectUrl);
            });
        });
    }

    // Open an about:blank popup with custom URL input. Returns true if popup created.
    function openAppPopup(redirectUrl, appName) {
        const features = 'width=1000,height=700,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes';
        let popup = null;
        try {
            const winName = 'app_popup_' + (appName || 'app');
            popup = window.open('about:blank', winName, features);
        } catch (e) {
            popup = null;
        }

        if (!popup) return false;

        try {
            const doc = popup.document;
            doc.open();
            // Encode the URL to avoid detection in source code
            const encodedUrl = btoa(redirectUrl);
            doc.write(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src *; style-src * 'unsafe-inline'; script-src * 'unsafe-inline' 'unsafe-eval'; img-src * data:; font-src * data:;"><title>about:blank</title><style>*{margin:0;padding:0}html,body{width:100%;height:100%;font-family:Arial,sans-serif;background:#f0f0f0;display:flex;flex-direction:column}#toolbar{background:#fff;padding:8px;border-bottom:1px solid #ddd;display:flex;gap:6px;align-items:center;flex-shrink:0;z-index:999999}#urlInput{flex:1;padding:8px 10px;border:1px solid #ccc;border-radius:4px;font-size:14px}#goBtn{padding:8px 14px;background:#0b66c3;color:#fff;border:none;border-radius:4px;cursor:pointer;z-index:999999}#goBtn:hover{background:#0952a3}#contentArea{flex:1;overflow:auto;width:100%}</style></head><body><div id="toolbar"><input id="urlInput" type="text" placeholder="Search Google or enter URL..." value="" /><button id="goBtn">Go</button></div><div id="contentArea"></div><script>(function(){try{var encodedUrl="${encodedUrl}";var decodedUrl=atob(encodedUrl);var input=document.getElementById('urlInput');input.value=decodedUrl;var btn=document.getElementById('goBtn');var contentArea=document.getElementById('contentArea');function navigate(){var val=input.value.trim();if(!val)return;var url=val;if(!val.startsWith('http://') && !val.startsWith('https://')){var searchQuery=encodeURIComponent(val);try{var xhr=new XMLHttpRequest();xhr.open('GET','/api/search/google?q='+searchQuery,true);xhr.timeout=5000;xhr.onload=function(){try{var data=JSON.parse(xhr.responseText);if(data.redirect){url=data.url;}else if(data.results && data.results.length>0){url=data.results[0].url;}}catch(e){}doNavigate(url);};xhr.onerror=function(){doNavigate('https://www.google.com/search?q='+searchQuery);};xhr.send();}catch(e){doNavigate('https://www.google.com/search?q='+searchQuery);}}else{doNavigate(url);}}function doNavigate(url){try{window.location.href=url;}catch(e){contentArea.innerHTML='<iframe src="'+url+'" style="width:100%;height:100%;border:0;"></iframe>';}}btn.addEventListener('click',navigate);input.addEventListener('keydown',function(e){if(e.key==='Enter')navigate();});document.addEventListener('keydown',function(e){if(e.ctrlKey && e.key==='l'){e.preventDefault();input.focus();input.select();}});var originalFetch=window.fetch;var originalXHR=window.XMLHttpRequest;window.fetch=originalFetch;window.XMLHttpRequest=originalXHR;}catch(e){console.error(e);}})();<\/script></body></html>`);
            doc.close();
            try { popup.focus(); } catch (e) {}
            return true;
        } catch (err) {
            try { popup.close(); } catch (e) {}
            return false;
        }
    }

    // Open a popup with a simple search UI (about:blank). Returns true if opened.
    function openSearchPopupWindow() {
        const features = 'width=1000,height=700,menubar=no,toolbar=no,location=yes,resizable=yes,scrollbars=yes';
        let popup = null;
        try { popup = window.open('about:blank', '_blank', features); } catch (e) { popup = null; }
        if (!popup) return false;

        try {
            const doc = popup.document;
            doc.open();
            doc.write(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>about:blank</title><style>body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:18px;background:#f6f7fb} .container{max-width:920px;margin:24px auto;background:#fff;padding:18px;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.08)} input{width:100%;padding:10px 12px;border:1px solid #ccc;border-radius:6px;font-size:16px} button{margin-top:10px;padding:10px 14px;border-radius:6px;background:#0b66c3;color:#fff;border:none;cursor:pointer} .small{font-size:13px;color:#666;margin-top:8px}</style></head><body><div class="container"><h2 style="margin-top:0">Search Google</h2><form id="gform"><input id="ginput" type="search" placeholder="Type your search and press Enter" autocomplete="off" /><div style="display:flex;gap:8px;margin-top:10px"><button id="gsearch" type="submit">Search</button><button id="gclose" type="button" style="background:#6c757d">Close</button></div><p class="small">Search results will open in this window.</p></form></div><script> (function(){ var form=document.getElementById('gform'); var input=document.getElementById('ginput'); var btn=document.getElementById('gsearch'); var closeBtn=document.getElementById('gclose'); form.addEventListener('submit',function(e){ e.preventDefault(); var q=input.value.trim(); if(!q) return; var url='https://www.google.com/search?q='+encodeURIComponent(q); window.location.href=url; }); closeBtn.addEventListener('click',function(){ try{ window.close(); }catch(e){} }); input.focus(); })(); <\/script></body></html>`);
            doc.close();
            try { popup.focus(); } catch (e) {}
            return true;
        } catch (err) {
            try { popup.close(); } catch (e) {}
            return false;
        }
    }

    // Modal fallback for blocked popups
    function showPopupBlockedModal(url) {
        let modal = document.getElementById('popupBlockedModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'popupBlockedModal';
            modal.style.position = 'fixed';
            modal.style.left = '0';
            modal.style.top = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.background = 'rgba(0,0,0,0.5)';
            modal.style.zIndex = '99999';

            modal.innerHTML = `
                <div style="background:#fff;padding:18px;border-radius:8px;max-width:520px;width:92%;box-shadow:0 8px 24px rgba(0,0,0,0.2);font-family:inherit;">
                    <h3 style="margin-top:0">Popup Blocked</h3>
                    <p>It looks like your browser blocked opening a new window. You can open the app manually, search for it via Google, or allow popups for this site.</p>
                    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px;flex-wrap:wrap;">
                        <button id="pbOpenSameBtn" style="background:#007bff;color:#fff;border:none;padding:8px 12px;border-radius:4px;cursor:pointer">Open Here</button>
                        <button id="pbGoogleBtn" style="background:#0b66c3;color:#fff;border:none;padding:8px 12px;border-radius:4px;cursor:pointer">Search via Google</button>
                        <button id="pbCopyBtn" style="background:#6c757d;color:#fff;border:none;padding:8px 12px;border-radius:4px;cursor:pointer">Copy Link</button>
                        <button id="pbCloseBtn" style="background:transparent;border:1px solid #ccc;padding:8px 12px;border-radius:4px;cursor:pointer">Close</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            document.getElementById('pbCloseBtn').addEventListener('click', () => { modal.style.display = 'none'; });
            document.getElementById('pbOpenSameBtn').addEventListener('click', () => { window.location.href = document.getElementById('pbOpenSameBtn').dataset.url || url; });
            document.getElementById('pbGoogleBtn').addEventListener('click', () => { const link = document.getElementById('pbOpenSameBtn').dataset.url || url; openGoogleSearchFor(link); });
            document.getElementById('pbCopyBtn').addEventListener('click', async () => {
                const link = document.getElementById('pbOpenSameBtn').dataset.url || url;
                try {
                    await navigator.clipboard.writeText(link);
                    alert('Link copied to clipboard');
                } catch (e) {
                    prompt('Copy this link:', link);
                }
            });
        }

        document.getElementById('pbOpenSameBtn').dataset.url = url;
        modal.style.display = 'flex';
    }

    function openGoogleSearchFor(targetUrl) {
        try {
            let q = targetUrl;
            try {
                const u = new URL(targetUrl);
                q = u.hostname;
            } catch (e) {
                q = targetUrl;
            }
            const googleUrl = 'https://www.google.com/search?q=' + encodeURIComponent(q);
            const win = window.open(googleUrl, '_blank');
            if (!win) window.location.href = googleUrl;
        } catch (err) {
            console.error('Failed to open Google search fallback:', err);
            try { window.location.href = targetUrl; } catch (e) {}
        }
    }

    function createSearchModal() {
        let modal = document.getElementById('searchModal');
        if (modal) {
            modal.style.display = 'flex';
            const input = modal.querySelector('#searchInput');
            if (input) input.focus();
            return;
        }

        modal = document.createElement('div');
        modal.id = 'searchModal';
        modal.style.position = 'fixed';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.background = 'rgba(0,0,0,0.6)';
        modal.style.zIndex = '100000';

        modal.innerHTML = `
            <div style="background:#fff;padding:16px;border-radius:8px;max-width:980px;width:92%;height:76%;display:flex;flex-direction:column;">
                <div style="display:flex;gap:8px;align-items:center;">
                    <input id="searchInput" placeholder="Type your search and press Enter" style="flex:1;padding:10px;border:1px solid #ccc;border-radius:6px;font-size:16px;" />
                    <button id="searchDoBtn" style="padding:10px 14px;border-radius:6px;background:#0b66c3;color:#fff;border:none;">Search</button>
                    <button id="searchCloseBtn" style="margin-left:8px;padding:8px 10px;border-radius:6px;background:#eee;border:1px solid #ccc;">Close</button>
                </div>
                <div id="searchFrameWrap" style="flex:1;margin-top:12px;position:relative;background:#f8f8f8;border-radius:6px;overflow:hidden;">
                    <iframe id="searchFrame" src="about:blank" style="width:100%;height:100%;border:0;background:#fff;"></iframe>
                    <div id="searchFrameBlocked" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;flex-direction:column;padding:18px;">
                        <p style="color:#333;max-width:720px;text-align:center;">The site may block embedding. You can open search results in a new tab instead.</p>
                        <div style="margin-top:12px;display:flex;gap:8px;">
                            <button id="openSearchNewTab" style="padding:8px 12px;background:#007bff;color:#fff;border:none;border-radius:6px;">Open in New Tab</button>
                            <button id="openSearchSameTab" style="padding:8px 12px;background:#6c757d;color:#fff;border:none;border-radius:6px;">Open Here</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const input = modal.querySelector('#searchInput');
        const btn = modal.querySelector('#searchDoBtn');
        const closeBtn = modal.querySelector('#searchCloseBtn');
        const iframe = modal.querySelector('#searchFrame');
        const blocked = modal.querySelector('#searchFrameBlocked');
        const openNewTab = modal.querySelector('#openSearchNewTab');
        const openSameTab = modal.querySelector('#openSearchSameTab');

        function doSearch(q) {
            if (!q) return;
            const googleUrl = 'https://www.google.com/search?q=' + encodeURIComponent(q);
            window.location.href = googleUrl;
        }

        btn.addEventListener('click', () => doSearch(input.value.trim()));
        input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') doSearch(input.value.trim()); });
        closeBtn.addEventListener('click', () => { modal.style.display = 'none'; iframe.src = 'about:blank'; });

        input.focus();
    }

    // Start initialization
    await updateAppAccess();

    // Refresh premium status periodically
    setInterval(updateAppAccess, 5000);

});
