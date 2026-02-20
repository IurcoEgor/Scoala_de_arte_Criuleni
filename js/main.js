document.addEventListener("DOMContentLoaded", function () {
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
        "contacte": "Info & Contacte",
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
});

function checkLength(el) {
    const maxLength = 300;
    const currentLength = el.value.length;
    const charCount = document.getElementById('charCount');
    charCount.textContent = `${currentLength}/${maxLength} caractere`;
    if (currentLength >= maxLength) {
        charCount.style.color = 'red';
    } else {
        charCount.style.color = 'black';
    }
}
