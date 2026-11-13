// Calendar app with live clock, Chinese festivals, and solar terms
class CalendarApp {
    constructor() {
        this.today = new Date();
        this.currentYear = this.today.getFullYear();
        this.currentMonth = this.today.getMonth();
        this.selectedCell = null;
        this.clockTimer = null;
        this.cultureCache = new Map();

        // Keep the grid focused on Chinese festivals / public holidays
        this.ignoredFestivalPattern =
            /情人节|愚人节|万圣节|圣诞节|感恩节|复活节|母亲节|父亲节|护士节|光棍|白色情人|黑色星期|世界|国际|联合国/;

        if (this.checkDOMElements()) {
            this.init();
        }
    }

    checkDOMElements() {
        return document.getElementById('calendar') &&
               document.getElementById('currentMonthDisplay') &&
               document.getElementById('todayInfo') &&
               document.getElementById('prevMonth') &&
               document.getElementById('nextMonth');
    }

    init() {
        this.updateAppTitle();
        this.bindEvents();
        this.renderCalendar();
        this.updateTodayInfo();
        this.startLiveClock();
    }

    updateAppTitle() {
        const year = new Date().getFullYear();
        const title = document.getElementById('appTitle');
        const yearLabel = document.getElementById('appYearLabel');
        const pageTitle = `${year}年日历 · 节日节气`;

        if (title) {
            title.textContent = `${year}年日历`;
        }
        if (yearLabel) {
            yearLabel.textContent = `${year} · 节日 · 节气`;
        }
        document.title = pageTitle;
    }

    bindEvents() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        const todayBtn = document.getElementById('todayBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousMonth());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextMonth());
        }
        if (todayBtn) {
            todayBtn.addEventListener('click', () => this.goToToday());
        }
    }

    startLiveClock() {
        const clockEl = document.getElementById('liveClock');
        if (!clockEl) {
            return;
        }

        const tick = () => {
            const now = new Date();
            const datePart = now.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            });
            const timePart = now.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            clockEl.innerHTML = `${datePart} · <strong>${timePart}</strong>`;

            if (
                now.getFullYear() !== this.today.getFullYear() ||
                now.getMonth() !== this.today.getMonth() ||
                now.getDate() !== this.today.getDate()
            ) {
                this.today = now;
                this.updateAppTitle();
                this.updateTodayInfo();
                this.renderCalendar();
            }
        };

        tick();
        this.clockTimer = setInterval(tick, 1000);
    }

    // ISO 8601 week number
    getWeekOfYear(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDay();
    }

    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        return Math.floor((date - start) / 86400000);
    }

    getDaysInYear(year) {
        return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
    }

    formatMonthYear(date) {
        const months = [
            '一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ];
        return `${date.getFullYear()}年 ${months[date.getMonth()]}`;
    }

    cultureKey(year, month, day) {
        return `${year}-${month + 1}-${day}`;
    }

    shortenFestivalName(name) {
        if (!name) {
            return '';
        }
        // Keep short traditional names readable in compact cells
        const aliases = {
            '元旦节': '元旦',
            '春节': '春节',
            '元宵节': '元宵',
            '端午节': '端午',
            '七夕节': '七夕',
            '中秋节': '中秋',
            '重阳节': '重阳',
            '腊八节': '腊八',
            '除夕': '除夕',
            '劳动节': '劳动',
            '国庆节': '国庆',
            '妇女节': '妇女',
            '青年节': '青年',
            '儿童节': '儿童',
            '建军节': '建军',
            '教师节': '教师',
            '植树节': '植树',
            '清明节': '清明'
        };
        if (aliases[name]) {
            return aliases[name];
        }
        return name.replace(/节$/, '');
    }

    filterFestivals(list) {
        return (list || []).filter((name) => !this.ignoredFestivalPattern.test(name));
    }

    getCultureInfo(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const key = this.cultureKey(year, month, day);

        if (this.cultureCache.has(key)) {
            return this.cultureCache.get(key);
        }

        if (typeof Solar === 'undefined') {
            const empty = {
                festivals: [],
                jieqi: '',
                lunarText: '',
                ganZhiDay: '',
                nextJieQi: null,
                prevJieQi: null,
                primaryLabel: '',
                labelType: ''
            };
            this.cultureCache.set(key, empty);
            return empty;
        }

        const solar = Solar.fromYmd(year, month + 1, day);
        const lunar = solar.getLunar();
        const festivals = this.filterFestivals([
            ...solar.getFestivals(),
            ...lunar.getFestivals()
        ]);
        // Prefer traditional lunar names when duplicates appear (e.g. 清明)
        const uniqueFestivals = [...new Set(festivals)];
        const jieqi = lunar.getJieQi() || '';
        const lunarText = `农历${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
        const ganZhiDay = `${lunar.getDayInGanZhi()}日`;

        let nextJieQi = null;
        let prevJieQi = null;
        try {
            const next = lunar.getNextJieQi(true);
            const prev = lunar.getPrevJieQi(true);
            if (next) {
                nextJieQi = {
                    name: next.getName(),
                    date: next.getSolar().toYmd()
                };
            }
            if (prev) {
                prevJieQi = {
                    name: prev.getName(),
                    date: prev.getSolar().toYmd()
                };
            }
        } catch (err) {
            // Ignore optional jieqi navigation failures
        }

        let primaryLabel = '';
        let labelType = '';
        if (uniqueFestivals.length) {
            primaryLabel = this.shortenFestivalName(uniqueFestivals[0]);
            labelType = 'festival';
        } else if (jieqi) {
            primaryLabel = jieqi;
            labelType = 'jieqi';
        }

        const info = {
            festivals: uniqueFestivals,
            jieqi,
            lunarText,
            ganZhiDay,
            nextJieQi,
            prevJieQi,
            primaryLabel,
            labelType
        };
        this.cultureCache.set(key, info);
        return info;
    }

    formatCultureSummary(culture) {
        const parts = [];
        if (culture.festivals.length) {
            parts.push(`节日：<strong class="tag-festival">${culture.festivals.join('、')}</strong>`);
        }
        if (culture.jieqi) {
            parts.push(`节气：<strong class="tag-jieqi">${culture.jieqi}</strong>`);
        }
        return parts.join('<br>');
    }

    renderCalendar() {
        const calendarDiv = document.getElementById('calendar');
        calendarDiv.innerHTML = '';
        calendarDiv.className = 'calendar';
        this.selectedCell = null;

        const year = this.currentYear;
        const month = this.currentMonth;

        document.getElementById('currentMonthDisplay').textContent =
            this.formatMonthYear(new Date(year, month));

        const weekdayHeader = document.createElement('div');
        weekdayHeader.className = 'weekday-header';
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        weekdays.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            weekdayHeader.appendChild(dayHeader);
        });
        calendarDiv.appendChild(weekdayHeader);

        const daysGrid = document.createElement('div');
        daysGrid.className = 'days-grid';

        const firstDay = this.getFirstDayOfMonth(year, month);
        const daysInMonth = this.getDaysInMonth(year, month);
        const daysInPrevMonth = this.getDaysInMonth(year, month - 1);

        for (let i = 0; i < firstDay; i++) {
            const dayCell = this.createCompactDayCell(
                year, month - 1, daysInPrevMonth - firstDay + i + 1, true
            );
            daysGrid.appendChild(dayCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = this.createCompactDayCell(year, month, day, false);
            daysGrid.appendChild(dayCell);
        }

        const totalCells = firstDay + daysInMonth;
        const remainingCells = Math.ceil(totalCells / 7) * 7 - totalCells;
        for (let day = 1; day <= remainingCells; day++) {
            const dayCell = this.createCompactDayCell(year, month + 1, day, true);
            daysGrid.appendChild(dayCell);
        }

        calendarDiv.appendChild(daysGrid);
    }

    createCompactDayCell(year, month, day, isOtherMonth) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';

        if (isOtherMonth) {
            dayCell.classList.add('other-month');
        }

        const currentDate = new Date(year, month, day);
        const today = new Date();

        if (currentDate.getDate() === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()) {
            dayCell.classList.add('today');
        }

        const weekNumber = this.getWeekOfYear(currentDate);
        const culture = this.getCultureInfo(currentDate);

        if (culture.labelType) {
            dayCell.classList.add(`has-${culture.labelType}`);
        }

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;

        const meta = document.createElement('div');
        meta.className = 'day-meta';

        if (culture.primaryLabel) {
            const label = document.createElement('div');
            label.className = `culture-label ${culture.labelType}`;
            label.textContent = culture.primaryLabel;
            meta.appendChild(label);
        } else {
            const weekInfo = document.createElement('div');
            weekInfo.className = 'week-info';
            weekInfo.textContent = `${weekNumber}周`;
            meta.appendChild(weekInfo);
        }

        dayCell.appendChild(dayNumber);
        dayCell.appendChild(meta);

        const tipParts = [culture.lunarText];
        if (culture.festivals.length) {
            tipParts.push(culture.festivals.join('、'));
        }
        if (culture.jieqi) {
            tipParts.push(`节气 ${culture.jieqi}`);
        }
        tipParts.push(`第${weekNumber}周`);
        dayCell.title = tipParts.filter(Boolean).join(' · ');

        dayCell.addEventListener('click', () => {
            if (this.selectedCell) {
                this.selectedCell.classList.remove('selected');
            }
            dayCell.classList.add('selected');
            this.selectedCell = dayCell;
            this.showDayInfo(currentDate, weekNumber, culture);
        });

        return dayCell;
    }

    showDayInfo(date, weekNumber, culture = null) {
        const panel = document.getElementById('selectedDayInfo');
        if (!panel) {
            return;
        }

        const info = culture || this.getCultureInfo(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        const formattedDate = date.toLocaleDateString('zh-CN', options);
        const cultureSummary = this.formatCultureSummary(info);

        let jieqiNearby = '';
        if (!info.jieqi && info.nextJieQi) {
            jieqiNearby = `<br>下一节气：<strong class="tag-jieqi">${info.nextJieQi.name}</strong>（${info.nextJieQi.date}）`;
        }

        panel.hidden = false;
        panel.innerHTML = `
            已选：<strong>${formattedDate}</strong><br>
            ${info.lunarText} · ${info.ganZhiDay}<br>
            本年度 <strong>第 ${weekNumber} 周</strong>
            ${cultureSummary ? `<br>${cultureSummary}` : ''}
            ${jieqiNearby}
        `;
    }

    updateTodayInfo() {
        const today = new Date();
        const weekNumber = this.getWeekOfYear(today);
        const dayOfYear = this.getDayOfYear(today);
        const daysLeft = this.getDaysInYear(today.getFullYear()) - dayOfYear;
        const culture = this.getCultureInfo(today);

        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        const formattedDate = today.toLocaleDateString('zh-CN', options);
        const cultureSummary = this.formatCultureSummary(culture);

        let jieqiLine = '';
        if (!culture.jieqi && culture.nextJieQi) {
            jieqiLine = `<br>下一节气：<strong class="tag-jieqi">${culture.nextJieQi.name}</strong>（${culture.nextJieQi.date}）`;
        }

        document.getElementById('todayInfo').innerHTML = `
            今天是 <strong>${formattedDate}</strong><br>
            ${culture.lunarText} · ${culture.ganZhiDay}<br>
            本年度 <strong>第 ${weekNumber} 周</strong>，还剩 <strong>${daysLeft} 天</strong>
            ${cultureSummary ? `<br>${cultureSummary}` : ''}
            ${jieqiLine}
        `;
    }

    goToToday() {
        const now = new Date();
        this.today = now;
        this.currentYear = now.getFullYear();
        this.currentMonth = now.getMonth();
        this.renderCalendar();
        this.updateTodayInfo();

        const panel = document.getElementById('selectedDayInfo');
        if (panel) {
            panel.hidden = true;
            panel.innerHTML = '';
        }
    }

    previousMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.renderCalendar();
    }

    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.renderCalendar();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('test.html')) {
        console.log('测试环境，不自动初始化CalendarApp');
    } else if (document.getElementById('calendar')) {
        new CalendarApp();
    }
});
