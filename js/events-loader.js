document.addEventListener('DOMContentLoaded', async () => {
  const itemsPerPage = 9; // 3 pe rând x 3 rânduri

  // Determinare pagina curentă: ?page=N sau din numele fișierului (activitati2.html)
  function getCurrentPage() {
    const params = new URLSearchParams(window.location.search);
    const p = parseInt(params.get('page'));
    // Pagina este determinată exclusiv de parametrul '?page=N'.
    // Dacă parametrul lipsește sau este invalid, se consideră pagina 1.
    return (!isNaN(p) && p > 0) ? p : 1;
  }

  const page = getCurrentPage();

  // Folosește variabila globală EVENTS_DATA
  function parseDate(d) {
    const t = Date.parse(d);
    return isNaN(t) ? null : t;
  }

  // Generează cardul cu structură identică HTML-ului original static
  function renderCard(ev) {
    // <div class="news-card">
    //   <a href="...">
    //     <img src="..." alt="..." class="news-img">
    //   </a>
    //   <div class="news-body">
    //     <a href="...">
    //       <h3 class="news-title">Titlu</h3>
    //     </a>
    //     <p class="news-desc">Descriere</p> (opțional)
    //     <time class="news-date" datetime="..."></time>
    //   </div>
    // </div>

    const card = document.createElement('div');
    card.className = 'news-card';

    // Imaginea cu link
    const aImg = document.createElement('a');
    aImg.href = ev.link;
    const img = document.createElement('img');
    img.src = ev.image;
    img.alt = ev.alt || ev.title;
    img.className = 'news-img';
    aImg.appendChild(img);
    card.appendChild(aImg);

    // Body
    const body = document.createElement('div');
    body.className = 'news-body';

    // Titlu cu link
    const aTitle = document.createElement('a');
    aTitle.href = ev.link;
    const h3 = document.createElement('h3');
    h3.className = 'news-title';
    h3.textContent = ev.title;
    aTitle.appendChild(h3);
    body.appendChild(aTitle);

    // Descriere (opțional)
    if (ev.description) {
      const p = document.createElement('p');
      p.className = 'news-desc';
      p.textContent = ev.description;
      body.appendChild(p);
    }

    // Data
    const time = document.createElement('time');
    time.className = 'news-date';
    if (ev.date) {
      time.setAttribute('datetime', ev.date);
      const dt = new Date(ev.date);
      // Format identic cu staticul: 31 octombrie 2023
      time.textContent = dt.toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    body.appendChild(time);

    card.appendChild(body);
    return card;
  }

  function buildPagination(container, totalPages, current) {
    container.innerHTML = '';
    const baseFile = 'activitati.html';

    // Prev (doar dacă nu suntem pe prima pagină)
    if (current > 1) {
      const prevLink = document.createElement('a');
      prevLink.className = 'news-arrow';
      prevLink.title = 'Pagina precedentă';
      prevLink.href = (current - 1 === 1) ? baseFile : `${baseFile}?page=${current - 1}`;
      prevLink.innerHTML = '<i class="fa-solid fa-angle-left"></i>';
      container.appendChild(prevLink);
    }

    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
      const a = document.createElement('a');
      a.href = (i === 1) ? baseFile : `${baseFile}?page=${i}`;
      const btn = document.createElement('button');
      btn.className = `news-page-btn ${i === current ? 'active' : ''}`;
      btn.textContent = i;
      a.appendChild(btn);
      container.appendChild(a);
    }

    // Next (doar dacă nu suntem pe ultima pagină)
    if (current < totalPages) {
      const nextLink = document.createElement('a');
      nextLink.className = 'news-arrow';
      nextLink.title = 'Pagina următoare';
      nextLink.href = `${baseFile}?page=${current + 1}`;
      nextLink.innerHTML = '<i class="fa-solid fa-angle-right"></i>';
      container.appendChild(nextLink);
    }
  }

  // Folosește window.EVENTS_DATA
  const events = window.EVENTS_DATA ? [...window.EVENTS_DATA] : [];

  // Sortează desc după dată
  events.sort((a, b) => {
    const da = parseDate(a.date);
    const db = parseDate(b.date);
    if (da === null && db === null) return 0;
    if (da === null) return 1;
    if (db === null) return -1;
    return db - da;
  });

  const totalPages = Math.max(1, Math.ceil(events.length / itemsPerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = events.slice(start, start + itemsPerPage);

  const newsSection = document.getElementById('news-section') || document.querySelector('.news-section');
  const pagination = document.getElementById('news-pagination') || document.querySelector('.news-pagination');
  if (!newsSection || !pagination) return;

  newsSection.innerHTML = '';
  pageItems.forEach(ev => newsSection.appendChild(renderCard(ev)));

  buildPagination(pagination, totalPages, currentPage);

  // Animație modernă pentru cardurile de știri
  const animatedCards = newsSection.querySelectorAll('.news-card:not(.empty)');
  if (animatedCards.length > 0 && 'IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px 65px 0px" // Se activează puțin înainte de a fi complet vizibil
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedCards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 7}ms`; // Efect de cascadă
      observer.observe(card);
    });
  }
});
