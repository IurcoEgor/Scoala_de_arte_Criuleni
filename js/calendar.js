document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.querySelector('.calendar-widget');
    if (!calendarContainer || typeof window.EVENTS_DATA === 'undefined') {
        const announcementContainer = document.querySelector('.calendar-container');
        if (announcementContainer) {
            // Ascunde containerul lateral dacă nu se poate randa calendarul
            announcementContainer.style.display = 'none';
        }
        return;
    }

    const monthYearEl = document.getElementById('cal-month-year');
    const daysEl = document.getElementById('cal-days');
    const prevBtn = document.getElementById('cal-prev');
    const nextBtn = document.getElementById('cal-next');

    // Procesează evenimentele o singură dată pentru eficiență
    const eventsByDate = {};
    window.EVENTS_DATA.forEach(event => {
        const eventDate = new Date(event.date);
        if (isNaN(eventDate.getTime())) return; // Ignoră datele invalide
        // Cheia este în format YYYY-M-D pentru a evita problemele cu fusul orar
        const dateKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`;
        if (!eventsByDate[dateKey]) {
            eventsByDate[dateKey] = [];
        }
        eventsByDate[dateKey].push(event);
    });

    let currentDate = new Date();

    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    function renderCalendar() {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalizează data de azi pentru comparații corecte

        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const lastDayOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

        monthYearEl.textContent = currentDate.toLocaleDateString('ro-RO', {
            month: 'long',
            year: 'numeric'
        }).replace(/^\w/, c => c.toUpperCase());

        daysEl.innerHTML = '';

        // Zilele din luna precedentă
        let startDayIndex = firstDayOfMonth.getDay();
        if (startDayIndex === 0) startDayIndex = 7; // Luni=1, ..., Duminică=7

        for (let i = startDayIndex - 1; i > 0; i--) {
            const day = lastDayOfPrevMonth.getDate() - i + 1;
            daysEl.innerHTML += `<div class="calendar-day other-month"><span>${day}</span></div>`;
        }

        // Zilele din luna curentă
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const dateKey = `${dayDate.getFullYear()}-${dayDate.getMonth()}-${dayDate.getDate()}`;

            const dayEl = document.createElement('div');
            let classes = 'calendar-day';

            const daySpan = document.createElement('span');
            daySpan.textContent = i;

            if (isSameDay(dayDate, today)) {
                classes += ' today';
            }

            if (eventsByDate[dateKey]) {
                classes += ' has-event';
                const dayEvents = eventsByDate[dateKey];

                const tooltip = document.createElement('div');
                tooltip.className = 'event-tooltip';
                tooltip.innerHTML = dayEvents.map(e => e.title).join('<br>');
                dayEl.appendChild(tooltip);

                const dotsContainer = document.createElement('div');
                dotsContainer.className = 'dots-container';

                const hasPast = dayEvents.some(e => new Date(e.date) < today);
                const hasUpcoming = dayEvents.some(e => new Date(e.date) >= today);

                if (hasPast) dotsContainer.innerHTML += '<span class="event-dot past"></span>';
                if (hasUpcoming) dotsContainer.innerHTML += '<span class="event-dot upcoming"></span>';
                dayEl.appendChild(dotsContainer);

                if (dayEvents.length === 1) {
                    dayEl.style.cursor = 'pointer';
                    dayEl.addEventListener('click', () => {
                        window.location.href = dayEvents[0].link;
                    });
                }
            }

            dayEl.className = classes;
            dayEl.prepend(daySpan);
            daysEl.appendChild(dayEl);
        }

        // Zilele din luna următoare
        const endDayIndex = lastDayOfMonth.getDay();
        let nextDays = 7 - (endDayIndex === 0 ? 7 : endDayIndex);
        if (endDayIndex === 0) nextDays = 0; // Dacă se termină duminica, nu mai adăugăm zile

        for (let i = 1; i <= nextDays; i++) {
            daysEl.innerHTML += `<div class="calendar-day other-month"><span>${i}</span></div>`;
        }
    }

    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
});