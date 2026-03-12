document.addEventListener("DOMContentLoaded", function () {

    // Salvarea paginii curente pentru navigare (fix pentru file:// unde referrer lipsește)
    const pathName = window.location.pathname;
    const pageName = pathName.substring(pathName.lastIndexOf('/') + 1);
    if (pageName === 'index.html' || pageName === '' || pageName.startsWith('activitati')) {
        sessionStorage.setItem('last_main_page', window.location.href);
    }

    // Link dinamic pentru butoanele "home" pe paginile de știri
    const homeBtn = document.getElementById('home-news-link');
    const homeMenu = document.getElementById('home-news-link-menu');

    if (homeBtn || homeMenu) {
        const fallbackUrl = '../pages/activitati.html';
        let backUrl = fallbackUrl;
        const referrer = document.referrer;
        const storedReferrer = sessionStorage.getItem('last_main_page');

        // Folosim referrer dacă există, altfel încercăm sessionStorage
        const candidateUrl = referrer || storedReferrer;

        if (candidateUrl) {
            try {
                const urlObj = new URL(candidateUrl);
                const refPage = urlObj.pathname.substring(urlObj.pathname.lastIndexOf('/') + 1);

                // Permitem revenirea la index.html sau la paginile de activități
                if (refPage === 'index.html' || refPage.startsWith('activitati')) {
                    backUrl = candidateUrl; // Folosim URL-ul complet pentru a păstra parametrii
                }
            } catch (e) {
                // Dacă apare o eroare la parsarea URL-ului, se va folosi link-ul fallback.
                console.warn('Could not parse URL:', candidateUrl, e);
            }
        }
        if (homeBtn) homeBtn.setAttribute('href', backUrl);
        if (homeMenu) homeMenu.setAttribute('href', backUrl);
    }

    // Link dinamic pentru ultima pagină de activități
    if (window.EVENTS_DATA) {
        const itemsPerPage = 9; // Asigură-te că valoarea este aceeași ca în events-loader.js
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
    const inputs = document.querySelectorAll('#nume-prenume-elev, #nume-prenume-parinte, #localitate, #nume');
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
    };
    const pageTitle = pageTitles[window.location.pathname.split('/').pop().split('.')[0]] || "Activitate";
    if (span) span.textContent = pageTitle;

    // Meniu mobil
    const list = document.querySelectorAll('.navList');

    function activeLink() {
        list.forEach((item) => item.classList.remove('active'));
        this.classList.add('active');
    }
    list.forEach((item) => item.addEventListener('click', activeLink));

    // Setare automată a clasei active bazată pe URL
    const currentPath = window.location.pathname;
    list.forEach((item) => {
        const link = item.querySelector('a').getAttribute('href');
        // Verificăm dacă href-ul linkului se regăsește în calea curentă
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
        const buttons = panelToActivate.parentElement.querySelectorAll('button');
        const contents = panelToActivate.parentElement.querySelectorAll('.accordion-content');
        buttons.forEach((button) => {
            button.setAttribute('aria-expanded', false)
        });
        contents.forEach((contents) => {
            contents.setAttribute('aria-hidden', true)
        });
        panelToActivate.querySelector('button').setAttribute('aria-expanded', true);
        panelToActivate.querySelector('.accordion-content').setAttribute('aria-hidden', false);
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
        let cardsPerView = 3; // Desktop: 3 carduri vizibile
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

            // Șterge dots-urile vechi
            dotsContainer.innerHTML = '';

            // Creează dots-uri noi
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Pagina ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }

            // Resetează index dacă e necesară ajustare
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

        // Oprire autoplay la derulare manuală (ignorăm scroll programatic)
        let isUserScrolling = false;
        carousel.addEventListener('scroll', (e) => {
            // Dacă evenimentul nu este generat de utilizator, îl ignorăm
            if (e && e.isTrusted === false) return;
            isUserScrolling = true;
            stopAutoplay();

            // Resetează indicatorul după ce s-a terminat derularea
            clearTimeout(carousel.scrollTimeout);
            carousel.scrollTimeout = setTimeout(() => {
                isUserScrolling = false;
                // Repornim autoplay după scurt timp dacă nu există altă interacțiune
                startAutoplay();
            }, 150);
        });

        // Update la resize
        window.addEventListener('resize', () => {
            recreateDots();
        });

        // Auto-play (opțional)
        let autoplayInterval;
        function startAutoplay() {
            // Evităm crearea unor intervale multiple
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

        // Uncomment pentru a activa autoplay
        startAutoplay();
    }

    // Afișare ultimele 3 știri pe homepage
    const homepageNewsContainer = document.getElementById('homepage-news-section');
    if (homepageNewsContainer && window.EVENTS_DATA) {
        const events = [...window.EVENTS_DATA];

        // Sortează descrescător după dată
        events.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Preia primele 3
        const latestEvents = events.slice(0, 3);

        // Funcție pentru a genera un card de știre
        const createNewsCard = (event) => {
            const card = document.createElement('div');
            card.className = 'news-card';

            // Corectează căile pentru index.html (elimină ../ recursiv pentru securitate)
            const sanitize = p => { while (p.includes('../')) p = p.replace('../', ''); return p; };
            const imagePath = sanitize(event.image);
            const linkPath = sanitize(event.link);

            // Construiește descrierea, dacă există, pentru a fi identic cu pagina de activități
            const descriptionHtml = event.description ? `<p class="news-desc">${event.description}</p>` : '';

            // Formatează data pentru a fi identică cu cea din activitati.html
            const formattedDate = new Date(event.date).toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' });

            card.innerHTML = `
                <a href="${linkPath}">
                    <img src="${imagePath}" alt="${event.alt || event.title}" class="news-img">
                </a>
                <div class="news-body">
                    <a href="${linkPath}">
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
});

// Funcție pentru verificarea lungimii textului (definită global)
window.checkLength = function (el) {
    const maxLength = 300;
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

// Inițializare contor la încărcarea paginii (dacă există text)
const messageTextarea = document.querySelector('textarea[name="message"]');
if (messageTextarea) {
    window.checkLength(messageTextarea);
}

