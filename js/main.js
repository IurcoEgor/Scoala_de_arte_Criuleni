document.addEventListener("DOMContentLoaded", function () {

    const pathName = window.location.pathname;
    const pageName = pathName.substring(pathName.lastIndexOf('/') + 1);
    if (pageName === 'index.html' || pageName === '' || pageName.startsWith('activitati')) {
        sessionStorage.setItem('last_main_page', window.location.href);
    }

    const homeBtn = document.getElementById('home-news-link');
    const homeMenu = document.getElementById('home-news-link-menu');

    if (homeBtn || homeMenu) {
        const fallbackUrl = '../pages/activitati.html';
        let backUrl = fallbackUrl;
        const referrer = document.referrer;
        const storedReferrer = sessionStorage.getItem('last_main_page');

        const candidateUrl = referrer || storedReferrer;

        if (candidateUrl) {
            try {
                const urlObj = new URL(candidateUrl);
                const refPage = urlObj.pathname.substring(urlObj.pathname.lastIndexOf('/') + 1);

                if (refPage === 'index.html' || refPage.startsWith('activitati')) {
                    backUrl = candidateUrl;
                }
            } catch (e) {
                console.warn('Could not parse URL:', candidateUrl, e);
            }
        }
        if (homeBtn) homeBtn.setAttribute('href', backUrl);
        if (homeMenu) homeMenu.setAttribute('href', backUrl);
    }

    if (window.EVENTS_DATA) {
        const itemsPerPage = 9;
        const totalEvents = window.EVENTS_DATA.length;
        const totalPages = Math.max(1, Math.ceil(totalEvents / itemsPerPage));

        const lastPageLinks = document.querySelectorAll('.activitati-last-page');

        lastPageLinks.forEach(link => {
            const currentHref = link.getAttribute('href');
            const newHref = `${currentHref.split('?')[0]}?page=${totalPages}`;
            link.setAttribute('href', newHref);
        });
    }

    // Data
    var data = new Date();
    const anSpan = document.getElementById('an');
    if (anSpan) anSpan.innerHTML = data.getFullYear();

    // Formular
    const inputs = document.querySelectorAll('#nume-prenume-copil, #limba, #clasa-generala, #domiciliu-copil, #clasa-specialitate, #nume-mama, #domiciliu-mama, #nume-tata, #domiciliu-tata');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            this.value = this.value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        });
    });

    // Denumirea paginii
    const span = document.getElementById("page-name");
    const pageTitles = {
        "index": "Homepage",
        "despre": "Despre Noi",
        "istoricul": "Despre Noi - Istoric",
        "specializari": "Specializări",
        "activitati": "Activități",
        "contacte": "Contacte",
        "profesori": "Profesori",
        "404": "Eroare 404"
    };
    const pageTitle = pageTitles[window.location.pathname.split('/').pop().split('.')[0]] || "Activitate";
    if (span) span.textContent = pageTitle;

    // Hamburger Sidebar Menu
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (hamburgerBtn && sidebar && sidebarOverlay) {
        function toggleSidebar() {
            const isOpen = hamburgerBtn.classList.contains('active');
            hamburgerBtn.classList.toggle('active');
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
            hamburgerBtn.setAttribute('aria-expanded', !isOpen);
        }

        function closeSidebar() {
            hamburgerBtn.classList.remove('active');
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }

        hamburgerBtn.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);

        const sidebarLinks = sidebar.querySelectorAll('.sidebar-item > a, .sidebar-submenu a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', closeSidebar);
        });

        // Submenu
        const submenuToggles = sidebar.querySelectorAll('.submenu-toggle');
        submenuToggles.forEach(toggle => {
            toggle.addEventListener('click', function () {
                const parentItem = this.closest('.sidebar-item');
                const submenu = parentItem.querySelector('.sidebar-submenu');
                const isActive = this.classList.contains('active');

                submenuToggles.forEach(otherToggle => {
                    if (otherToggle !== this) {
                        otherToggle.classList.remove('active');
                        otherToggle.setAttribute('aria-expanded', 'false');
                        const otherSubmenu = otherToggle.closest('.sidebar-item').querySelector('.sidebar-submenu');
                        if (otherSubmenu) otherSubmenu.classList.remove('active');
                    }
                });

                this.classList.toggle('active');
                this.setAttribute('aria-expanded', !isActive);
                if (submenu) submenu.classList.toggle('active');
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                closeSidebar();
            }
        });
    }

    // Meniu mobil
    const list = document.querySelectorAll('.navList');

    function activeLink() {
        list.forEach((item) => item.classList.remove('active'));
        this.classList.add('active');
    }
    list.forEach((item) => item.addEventListener('click', activeLink));

    const currentPath = window.location.pathname;
    list.forEach((item) => {
        const link = item.querySelector('a').getAttribute('href');
        if (currentPath.includes(link) || (link === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('index.html')))) {
            list.forEach((li) => li.classList.remove('active'));
            item.classList.add('active');
        }
    });

    // Indicator meniu
    const navItems = document.querySelectorAll(".navMenu ul li");
    const indicator = document.querySelector(".indicator");
    const navList = document.querySelector(".navMenu ul");
    function updateIndicator() {
        const activeItem = document.querySelector(".navMenu ul li.active");
        if (activeItem && navList) {
            const activeItemRect = activeItem.getBoundingClientRect();
            const navListWidth = navList.offsetWidth;
            const navListHeight = navList.offsetHeight;
            const indicatorSize = Math.min(navListWidth, navListHeight);
            indicator.style.width = `${indicatorSize}px`;
            indicator.style.height = `${indicatorSize}px`;
            indicator.style.left = `${activeItemRect.left + (activeItemRect.width / 2) - (indicatorSize / 2)}px`;
        }
    }
    updateIndicator();
    navItems.forEach((item) => {
        item.addEventListener("click", function () {
            navItems.forEach((el) => el.classList.remove("active"));
            item.classList.add("active");
            updateIndicator();
        });
    });
    window.addEventListener("resize", updateIndicator);

    // Accordion
    const accordions = document.querySelectorAll(".accordion");
    accordions.forEach(accordion => {
        accordion.addEventListener("click", (e) => {
            const activePanel = e.target.closest(".accordion-panel");
            if (!activePanel) return;
            toggleAccordion(activePanel);
        });
    });
    function toggleAccordion(panelToActivate) {
        const button = panelToActivate.querySelector('button');
        const content = panelToActivate.querySelector('.accordion-content');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        const parent = panelToActivate.parentElement;
        const allPanels = parent.querySelectorAll('.accordion-panel');

        allPanels.forEach((panel) => {
            const btn = panel.querySelector('button');
            const cont = panel.querySelector('.accordion-content');

            if (panel === panelToActivate) {
                btn.setAttribute('aria-expanded', !isExpanded);
                cont.setAttribute('aria-hidden', isExpanded);
            } else {
                btn.setAttribute('aria-expanded', 'false');
                cont.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Scroll to top button
    const scrollBtn = document.getElementById("scrollTopBtn");
    if (scrollBtn) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 200) {
                scrollBtn.classList.add("show");
            } else {
                scrollBtn.classList.remove("show");
            }
        });
        scrollBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Carousel Parteneri
    const carousel = document.querySelector('.parteneri-carousel');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const cards = document.querySelectorAll('.partener-card');

    if (carousel && prevBtn && nextBtn && cards.length > 0) {
        let currentIndex = 0;
        let cardsPerView = 3;
        let totalDots = 0;

        function getCardsPerView() {
            const screenWidth = window.innerWidth;
            if (screenWidth > 1200) {
                return 3;
            } else if (screenWidth > 720) {
                return 2;
            } else {
                return 1;
            }
        }

        function recreateDots() {
            cardsPerView = getCardsPerView();
            totalDots = Math.max(1, cards.length - cardsPerView + 1);

            dotsContainer.innerHTML = '';

            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Pagina ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }

            if (currentIndex >= totalDots) {
                currentIndex = totalDots - 1;
            }
            updateDots();
        }

        // Inițializare
        recreateDots();

        function updateCarousel() {
            const cardWidth = cards[0].offsetWidth + 20; // Recalculează din nou
            const scrollDistance = currentIndex * cardWidth;
            carousel.scrollLeft = scrollDistance;
            updateDots();
        }

        function updateDots() {
            const dots = document.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, totalDots - 1));
            updateCarousel();
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalDots - 1) {
                currentIndex++;
                updateCarousel();
            }
        });

        let isUserScrolling = false;
        carousel.addEventListener('scroll', (e) => {
            if (e && e.isTrusted === false) return;
            isUserScrolling = true;
            stopAutoplay();

            clearTimeout(carousel.scrollTimeout);
            carousel.scrollTimeout = setTimeout(() => {
                isUserScrolling = false;
                startAutoplay();
            }, 150);
        });

        window.addEventListener('resize', () => {
            recreateDots();
        });

        let autoplayInterval;
        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(() => {
                if (currentIndex < totalDots - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateCarousel();
            }, 5000);
        }

        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }

        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);


        startAutoplay();
    }

    // Ultimele 3 știri pe homepage
    const homepageNewsContainer = document.getElementById('homepage-news-section');
    if (homepageNewsContainer && window.EVENTS_DATA) {
        const events = [...window.EVENTS_DATA];

        events.sort((a, b) => new Date(b.date) - new Date(a.date));

        const latestEvents = events.slice(0, 3);

        const createNewsCard = (event) => {
            const card = document.createElement('div');
            card.className = 'news-card';

            const sanitize = p => { while (p.includes('../')) p = p.replace('../', ''); return p; };
            const imagePath = sanitize(event.image);
            const linkPath = sanitize(event.link);

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const eventStart = new Date(event.date);
            const eventEnd = event.endDate ? new Date(event.endDate) : new Date(event.date);
            eventEnd.setHours(23, 59, 59, 999);

            let statusText = '';
            let statusClass = '';

            if (eventEnd < today) {
                statusText = 'Trecut';
                statusClass = 'status-past';
            } else if (eventStart > today) {
                statusText = 'Planificat';
                statusClass = 'status-upcoming';
            } else {
                statusText = 'Acum';
                statusClass = 'status-now';
            }

            const descriptionHtml = event.description ? `<p class="news-desc">${event.description}</p>` : '';

            let formattedDate = new Date(event.date).toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' });

            if (event.endDate) {
                const endDateObj = new Date(event.endDate);
                if (endDateObj.getTime() !== new Date(event.date).getTime()) {
                    const endFormatted = endDateObj.toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' });
                    formattedDate += ` - ${endFormatted}`;
                }
            }

            card.innerHTML = `
                <a href="${linkPath}" title="${event.title}">
                    <span class="event-status ${statusClass}">${statusText}</span>
                    <img src="${imagePath}" alt="${event.alt || event.title}" class="news-img" loading="lazy" height="175">
                </a>
                <div class="news-body">
                    <a href="${linkPath}" title="${event.title}">
                        <h3 class="news-title">${event.title}</h3>
                    </a>
                    ${descriptionHtml}
                    <time class="news-date" datetime="${event.date}">${formattedDate}</time>
                </div>
            `;
            return card;
        };

        homepageNewsContainer.innerHTML = '';
        latestEvents.forEach(event => {
            homepageNewsContainer.appendChild(createNewsCard(event));
        });
    }

    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add('visible');
                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            const delay = el.dataset.revealDelay;
            if (delay) {
                el.style.transitionDelay = `${delay}ms`;
            }
            observer.observe(el);
        });
    }
});

// Verificarea lungimii textului
window.checkLength = function (el) {
    const maxLength = 500;
    const currentLength = el.value.length;
    const charCount = document.getElementById('charCount');

    if (charCount) {
        charCount.textContent = `${currentLength} / ${maxLength}`;

        if (currentLength >= maxLength) {
            charCount.classList.add('limit-reached');
        } else {
            charCount.classList.remove('limit-reached');
        }
    }
};

const messageTextarea = document.querySelector('textarea[name="message"]');
if (messageTextarea) {
    window.checkLength(messageTextarea);
}
