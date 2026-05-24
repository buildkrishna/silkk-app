document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Scroll Progress Bar ---
    const progressBar = document.getElementById('progressBar');
    const updateScrollProgress = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    };
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // --- 2. Intersection Observer for Scroll Reveals ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -5% 0px'
    });
    revealElements.forEach((el) => revealObserver.observe(el));

    // --- 3. Section Navigation Highlighter ---
    const sections = document.querySelectorAll('section[id]');
    const desktopLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const mobileTabs = document.querySelectorAll('.mobile-tab-item[href^="#"]');

    const highlightActiveNav = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 160; // Offset for stickiness

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Fallback for top of page
        if (window.scrollY < 100) {
            currentSectionId = 'home';
        }

        // Highlight Desktop Links
        desktopLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Highlight Mobile Tabs
        mobileTabs.forEach((tab) => {
            tab.classList.remove('active');
            if (tab.getAttribute('href') === `#${currentSectionId}`) {
                tab.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightActiveNav, { passive: true });
    highlightActiveNav();

    // --- 4. Smooth Anchor Scrolling & History Sync ---
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
    allAnchorLinks.forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            event.preventDefault();
            const topOffset = targetElement.offsetTop - 80; // Account for topbar header height
            window.scrollTo({
                top: topOffset,
                behavior: 'smooth'
            });
            history.replaceState(null, '', targetId);
        });
    });

    // --- 5. High-Fidelity macOS Terminal Typewriter Simulation ---
    const termTyped = document.getElementById('termTyped');
    const termLogs = document.getElementById('termLogs');
    const termCursor = document.getElementById('termCursor');

    if (termTyped && termLogs) {
        const commandString = 'npx silkk init --brand=premium';
        let charIndex = 0;
        
        const logs = [
            { text: '✔ Core package resolved: silkk@5.0.0', type: 'success', delay: 400 },
            { text: '✔ Integrity check passed (100% available)', type: 'success', delay: 300 },
            { text: 'ℹ Negotiating handshakes: escrow secured', type: 'info', delay: 500 },
            { text: 'ℹ Transfer protocol: EPP immediate unlock ready', type: 'info', delay: 400 },
            { text: '', type: 'spacer', delay: 200 },
            { text: '~ silkk.app is initialized!', type: 'header', delay: 300 },
            { text: '  → Name:       silkk', type: 'metric', delay: 200 },
            { text: '  → Ext:        .app', type: 'metric', delay: 150 },
            { text: '  → Syllables:  1 (fluid vocal signature)', type: 'metric', delay: 150 },
            { text: '  → Letters:    5 (high recall ratio)', type: 'metric', delay: 150 },
            { text: '  → Status:     READY FOR DEVELOPMENT', type: 'success', delay: 250 },
            { text: '', type: 'spacer', delay: 200 },
            { text: 'visitor@silkk.app % ', type: 'prompt', delay: 300 }
        ];

        // Simulate Command Typing
        const typeCommand = () => {
            if (charIndex < commandString.length) {
                termTyped.textContent += commandString.charAt(charIndex);
                charIndex++;
                setTimeout(typeCommand, 60 + Math.random() * 40); // Natural random typing cadence
            } else {
                // Done typing. Remove block cursor from command line after brief pause
                setTimeout(() => {
                    if (termCursor) termCursor.style.display = 'none';
                    startPrintingLogs(0);
                }, 500);
            }
        };

        // Print logs step-by-step
        const startPrintingLogs = (index) => {
            if (index < logs.length) {
                const log = logs[index];
                setTimeout(() => {
                    const row = document.createElement('div');
                    row.className = 'term-output-log';

                    if (log.type === 'success') {
                        row.innerHTML = `<span class="term-success-text">${log.text}</span>`;
                    } else if (log.type === 'info') {
                        row.innerHTML = `<span style="color: var(--term-dir);">${log.text}</span>`;
                    } else if (log.type === 'header') {
                        row.innerHTML = `<span style="color: #ffffff; font-weight: bold;">${log.text}</span>`;
                    } else if (log.type === 'metric') {
                        row.innerHTML = `<span style="color: var(--term-text);">${log.text}</span>`;
                    } else if (log.type === 'spacer') {
                        row.innerHTML = '&nbsp;';
                    } else if (log.type === 'prompt') {
                        row.innerHTML = `<span class="term-user">visitor</span>@<span class="term-dir">silkk.app</span> % <span class="term-cursor"></span>`;
                    }

                    termLogs.appendChild(row);
                    
                    // Auto-scroll inside terminal if logs overflow
                    const terminalBody = document.getElementById('terminalBody');
                    if (terminalBody) {
                        terminalBody.scrollTop = terminalBody.scrollHeight;
                    }

                    startPrintingLogs(index + 1);
                }, log.delay);
            }
        };

        // Start typing after a short initial delay when hero fades in
        setTimeout(typeCommand, 1000);
    }
});
