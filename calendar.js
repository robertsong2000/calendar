// 添加DOM检查，避免在测试环境中出错
class CalendarApp {
    constructor() {
        this.currentDate = new Date();
        this.currentYear = this.currentDate.getFullYear();
        this.currentMonth = this.currentDate.getMonth();
        this.today = new Date();
        
        // 检查必要的DOM元素是否存在
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
        if (this.checkDOMElements()) {
            this.bindEvents();
            this.renderCalendar();
            this.updateTodayInfo();
        }
    }

    bindEvents() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousMonth();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextMonth();
            });
        }
    }

    // 使用ISO 8601标准计算周数
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

    formatMonthYear(date) {
        const months = [
            '一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ];
        return `${date.getFullYear()}年 ${months[date.getMonth()]}`;
    }

    renderCalendar() {
        const calendarDiv = document.getElementById('calendar');
        calendarDiv.innerHTML = '';
        calendarDiv.className = 'calendar';

        const year = this.currentYear;
        const month = this.currentMonth;

        document.getElementById('currentMonthDisplay').textContent = this.formatMonthYear(new Date(year, month));

        // 创建星期标题行
        const weekdayHeader = document.createElement('div');
        weekdayHeader.className = 'weekday-header';
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        weekdays.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            weekdayHeader.appendChild(dayHeader);
        });
        calendarDiv.appendChild(weekdayHeader);

        // 创建日期网格
        const daysGrid = document.createElement('div');
        daysGrid.className = 'days-grid';

        const firstDay = this.getFirstDayOfMonth(year, month);
        const daysInMonth = this.getDaysInMonth(year, month);
        const daysInPrevMonth = this.getDaysInMonth(year, month - 1);

        // 上个月的日期
        for (let i = 0; i < firstDay; i++) {
            const dayCell = this.createCompactDayCell(year, month - 1, daysInPrevMonth - firstDay + i + 1, true);
            daysGrid.appendChild(dayCell);
        }

        // 当前月的日期
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = this.createCompactDayCell(year, month, day, false);
            daysGrid.appendChild(dayCell);
        }

        // 下个月的日期
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
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;

        const weekInfo = document.createElement('div');
        weekInfo.className = 'week-info';
        weekInfo.textContent = `${weekNumber}周`;

        dayCell.appendChild(dayNumber);
        dayCell.appendChild(weekInfo);

        dayCell.addEventListener('click', () => {
            this.showDayInfo(currentDate, weekNumber);
        });

        return dayCell;
    }

    showDayInfo(date, weekNumber) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        const formattedDate = date.toLocaleDateString('zh-CN', options);
        
        alert(`日期：${formattedDate}\n本年度第 ${weekNumber} 周`);
    }

    updateTodayInfo() {
        const today = new Date();
        const weekNumber = this.getWeekOfYear(today);
        
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        const formattedDate = today.toLocaleDateString('zh-CN', options);
        
        document.getElementById('todayInfo').innerHTML = `
            今天是 <strong>${formattedDate}</strong>，
            是本年度的 <strong>第 ${weekNumber} 周</strong>。
            今年还剩下 <strong>${365 - Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)} 天</strong>。
        `;
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

// 修改初始化逻辑，只在有完整DOM时自动初始化
document.addEventListener('DOMContentLoaded', () => {
    // 只在主页面自动初始化
    if (window.location.pathname.includes('test.html')) {
        // 测试页面不自动初始化
        console.log('测试环境，不自动初始化CalendarApp');
    } else if (document.getElementById('calendar')) {
        new CalendarApp();
    }
});