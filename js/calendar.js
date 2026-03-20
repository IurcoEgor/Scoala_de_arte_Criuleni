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

    // Închide tooltip-urile active când se dă click oriunde altundeva în pagină
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.calendar-day')) {
            document.querySelectorAll('.event-tooltip.active').forEach(t => {
                t.classList.remove('active');
            });
        }
    });

    let currentDate = new Date();

    function isSameDay(date1, date2) {
        return date1 && date2 &&
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    function renderCalendar() {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalizează data de azi pentru comparații corecte

        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Calculăm dimensiunile grilei complete (inclusiv zilele din luna anterioară și următoare)
        let startDayIndex = firstDayOfMonth.getDay();
        if (startDayIndex === 0) startDayIndex = 7; // Luni=1, ..., Duminică=7
        const prevDaysCount = startDayIndex - 1;

        const endDayIndex = lastDayOfMonth.getDay();
        let nextDaysCount = 7 - (endDayIndex === 0 ? 7 : endDayIndex);
        if (endDayIndex === 0) nextDaysCount = 0;

        const daysInCurrentMonth = lastDayOfMonth.getDate();
        const totalGridDays = prevDaysCount + daysInCurrentMonth + nextDaysCount;

        // Data de start a grilei (prima zi vizibilă, poate fi din luna anterioară)
        const gridStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1 - prevDaysCount);
        gridStartDate.setHours(0, 0, 0, 0);

        // Data de sfârșit a grilei
        const gridEndDate = new Date(gridStartDate);
        gridEndDate.setDate(gridStartDate.getDate() + totalGridDays - 1);
        gridEndDate.setHours(23, 59, 59, 999);

        monthYearEl.textContent = currentDate.toLocaleDateString('ro-RO', {
            month: 'long',
            year: 'numeric'
        }).replace(/^\w/, c => c.toUpperCase());

        daysEl.innerHTML = '';

        // Pregătire date pentru "scăriță" (sloturi vizuale)
        // Array de sloturi pentru toată grila (0...totalGridDays-1)
        const dailySlots = new Array(totalGridDays).fill(null).map(() => []);

        // Sortăm evenimentele după dată și durată pentru o așezare mai bună
        const sortedEvents = [...window.EVENTS_DATA].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA - dateB !== 0) return dateA - dateB;
            // Dacă încep în aceeași zi, cel mai lung primul
            const endA = a.endDate ? new Date(a.endDate) : dateA;
            const endB = b.endDate ? new Date(b.endDate) : dateB;
            return (endB - dateB) - (endA - dateA);
        });

        sortedEvents.forEach(event => {
            const start = new Date(event.date);
            const end = event.endDate ? new Date(event.endDate) : new Date(start);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            // Verificăm dacă evenimentul se intersectează cu grila vizibilă
            if (end < gridStartDate || start > gridEndDate) return;

            // Găsim indicii de start și sfârșit în grila noastră (0 ... totalGridDays-1)
            let sIdx = -1, eIdx = -1;

            // Iterăm prin grilă pentru a găsi intersecția exactă
            const loopDate = new Date(gridStartDate);
            for (let i = 0; i < totalGridDays; i++) {
                const loopEnd = new Date(loopDate);
                loopEnd.setHours(23, 59, 59, 999);

                if (loopEnd >= start && loopDate <= end) {
                    if (sIdx === -1) sIdx = i;
                    eIdx = i;
                }
                loopDate.setDate(loopDate.getDate() + 1);
            }

            if (sIdx === -1) return;

            // Algoritm simplificat de alocare sloturi (greedy)
            let slotIndex = 0;
            while (true) {
                let isSlotFree = true;
                for (let i = sIdx; i <= eIdx; i++) {
                    if (dailySlots[i][slotIndex] !== undefined) {
                        isSlotFree = false;
                        break;
                    }
                }
                if (isSlotFree) break;
                slotIndex++;
            }

            // Ocupăm slotul
            for (let i = sIdx; i <= eIdx; i++) {
                dailySlots[i][slotIndex] = event;
            }
        });

        // Randăm zilele (Grila completă)
        const renderDate = new Date(gridStartDate);

        for (let i = 0; i < totalGridDays; i++) {
            // Determinăm dacă ziua este în luna curentă sau următoare
            const isPrevMonth = i < prevDaysCount;
            const isNextMonth = i >= (prevDaysCount + daysInCurrentMonth);
            const isOtherMonth = isPrevMonth || isNextMonth;

            const dayEl = document.createElement('div');
            let classes = 'calendar-day';
            if (isOtherMonth) {
                classes += ' other-month';
            }

            const daySpan = document.createElement('span');
            daySpan.textContent = renderDate.getDate();

            if (!isOtherMonth && isSameDay(renderDate, today)) {
                classes += ' today'; // Păstrăm clasa today pentru evidențierea vizuală a zilei curente
            }

            const dayEventsSlots = dailySlots[i];
            const hasEvents = dayEventsSlots.some(ev => ev !== undefined);

            if (hasEvents) {
                classes += ' has-event';

                // Container pentru liniile de evenimente (bars)
                const dotsContainer = document.createElement('div');
                dotsContainer.className = 'dots-container';

                // Randăm barele conform sloturilor
                // Dacă un slot e gol dar există sloturi ocupate mai jos, lăsăm spațiu gol
                const maxSlot = dayEventsSlots.length;

                for (let s = 0; s < maxSlot; s++) {
                    const ev = dayEventsSlots[s];
                    const bar = document.createElement('div');

                    if (ev) {
                        bar.className = 'event-bar';

                        // Calculăm statusul
                        const start = new Date(ev.date); start.setHours(0, 0, 0, 0);
                        const end = ev.endDate ? new Date(ev.endDate) : new Date(start); end.setHours(23, 59, 59, 999);

                        if (end < today) bar.classList.add('past');
                        else if (start > today) bar.classList.add('upcoming');
                        else bar.classList.add('now');

                        // Calculăm forma barei (start, end, middle)
                        if (isSameDay(renderDate, start)) bar.classList.add('start');
                        if (isSameDay(renderDate, end)) bar.classList.add('end');

                        // Poziționare verticală bazată pe slot (fiecare bară are aprox 4px + 2px gap)
                        bar.style.top = `${s * 6}px`;
                    } else {
                        // Slot gol (spacer invizibil)
                        bar.style.height = '4px';
                        bar.style.marginBottom = '2px';
                    }
                    dotsContainer.appendChild(bar);
                }

                dayEl.appendChild(dotsContainer);

                // Tooltip și Navigare pe eveniment - DOAR pentru luna curentă
                if (!isOtherMonth) {
                    const activeEvents = dayEventsSlots.filter(e => e !== undefined);
                    if (activeEvents.length > 0) {
                        // Tooltip
                        const tooltip = document.createElement('div');
                        tooltip.className = 'event-tooltip';

                        if (activeEvents.length > 1) {
                            // Multiple evenimente: Generăm link-uri în tooltip
                            tooltip.innerHTML = activeEvents.map(e => `<a href="${e.link}" class="tooltip-link">${e.title}</a>`).join('');

                            // La click pe zi, fixăm tooltip-ul (toggle class active)
                            dayEl.style.cursor = 'pointer';
                            dayEl.addEventListener('click', (e) => {
                                e.stopPropagation(); // Previne închiderea imediată

                                // Dacă click-ul a fost pe un link din tooltip, nu facem toggle (lăsăm să navigheze)
                                if (e.target.classList.contains('tooltip-link')) return;

                                // Închidem alte tooltip-uri deschise
                                document.querySelectorAll('.event-tooltip.active').forEach(t => t !== tooltip && t.classList.remove('active'));

                                tooltip.classList.toggle('active');
                            });
                        } else {
                            // Un singur eveniment: Text simplu și navigare directă
                            tooltip.innerHTML = activeEvents[0].title;
                            dayEl.style.cursor = 'pointer';
                            dayEl.addEventListener('click', () => {
                                window.location.href = activeEvents[0].link;
                            });
                        }

                        dayEl.appendChild(tooltip);
                    }
                }
            }

            // Navigare la click pe zilele din alte luni (Spre luna respectivă)
            if (isOtherMonth) {
                if (isPrevMonth) {
                    dayEl.addEventListener('click', () => {
                        prevBtn.click();
                    });
                } else {
                    dayEl.addEventListener('click', () => {
                        nextBtn.click();
                    });
                }
            }

            dayEl.className = classes;
            dayEl.prepend(daySpan);
            daysEl.appendChild(dayEl);

            // Incrementăm data pentru următoarea iterație
            renderDate.setDate(renderDate.getDate() + 1);
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
