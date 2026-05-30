document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.querySelector('.calendar-widget');
    if (!calendarContainer || typeof window.EVENTS_DATA === 'undefined') {
        const announcementContainer = document.querySelector('.calendar-container');
        if (announcementContainer) {
            announcementContainer.style.display = 'none';
        }
        return;
    }

    const monthYearEl = document.getElementById('cal-month-year');
    const daysEl = document.getElementById('cal-days');
    const prevBtn = document.getElementById('cal-prev');
    const nextBtn = document.getElementById('cal-next');

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
        today.setHours(0, 0, 0, 0);

        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        let startDayIndex = firstDayOfMonth.getDay();
        if (startDayIndex === 0) startDayIndex = 7;
        const prevDaysCount = startDayIndex - 1;

        const endDayIndex = lastDayOfMonth.getDay();
        let nextDaysCount = 7 - (endDayIndex === 0 ? 7 : endDayIndex);
        if (endDayIndex === 0) nextDaysCount = 0;

        const daysInCurrentMonth = lastDayOfMonth.getDate();
        const totalGridDays = prevDaysCount + daysInCurrentMonth + nextDaysCount;

        const gridStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1 - prevDaysCount);
        gridStartDate.setHours(0, 0, 0, 0);

        const gridEndDate = new Date(gridStartDate);
        gridEndDate.setDate(gridStartDate.getDate() + totalGridDays - 1);
        gridEndDate.setHours(23, 59, 59, 999);

        monthYearEl.textContent = currentDate.toLocaleDateString('ro-RO', {
            month: 'long',
            year: 'numeric'
        }).replace(/^\w/, c => c.toUpperCase());

        daysEl.innerHTML = '';

        const dailySlots = new Array(totalGridDays).fill(null).map(() => []);

        const sortedEvents = [...window.EVENTS_DATA].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA - dateB !== 0) return dateA - dateB;
            const endA = a.endDate ? new Date(a.endDate) : dateA;
            const endB = b.endDate ? new Date(b.endDate) : dateB;
            return (endB - dateB) - (endA - dateA);
        });

        sortedEvents.forEach(event => {
            const start = new Date(event.date);
            const end = event.endDate ? new Date(event.endDate) : new Date(start);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            if (end < gridStartDate || start > gridEndDate) return;

            let sIdx = -1, eIdx = -1;

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

            for (let i = sIdx; i <= eIdx; i++) {
                dailySlots[i][slotIndex] = event;
            }
        });

        const renderDate = new Date(gridStartDate);

        for (let i = 0; i < totalGridDays; i++) {
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
                classes += ' today';
            }

            const dayEventsSlots = dailySlots[i];
            const hasEvents = dayEventsSlots.some(ev => ev !== undefined);

            if (hasEvents) {
                classes += ' has-event';

                const dotsContainer = document.createElement('div');
                dotsContainer.className = 'dots-container';

                const maxSlot = dayEventsSlots.length;

                for (let s = 0; s < maxSlot; s++) {
                    const ev = dayEventsSlots[s];
                    const bar = document.createElement('div');

                    if (ev) {
                        bar.className = 'event-bar';

                        const start = new Date(ev.date); start.setHours(0, 0, 0, 0);
                        const end = ev.endDate ? new Date(ev.endDate) : new Date(start); end.setHours(23, 59, 59, 999);

                        if (end < today) bar.classList.add('past');
                        else if (start > today) bar.classList.add('upcoming');
                        else bar.classList.add('now');

                        if (isSameDay(renderDate, start)) bar.classList.add('start');
                        if (isSameDay(renderDate, end)) bar.classList.add('end');

                        bar.style.top = `${s * 6}px`;
                    } else {
                        bar.style.height = '4px';
                        bar.style.marginBottom = '2px';
                    }
                    dotsContainer.appendChild(bar);
                }

                dayEl.appendChild(dotsContainer);

                if (!isOtherMonth) {
                    const activeEvents = dayEventsSlots.filter(e => e !== undefined);
                    if (activeEvents.length > 0) {
                        const tooltip = document.createElement('div');
                        tooltip.className = 'event-tooltip';

                        if (activeEvents.length > 1) {
                            tooltip.innerHTML = activeEvents.map(e => `<a href="${e.link}" class="tooltip-link">${e.title}</a>`).join('');

                            dayEl.style.cursor = 'pointer';
                            dayEl.addEventListener('click', (e) => {
                                e.stopPropagation();

                                if (e.target.classList.contains('tooltip-link')) return;

                                document.querySelectorAll('.event-tooltip.active').forEach(t => t !== tooltip && t.classList.remove('active'));

                                tooltip.classList.toggle('active');
                            });
                        } else {
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
