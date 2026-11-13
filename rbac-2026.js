// Source: 2026 RBAC Working Calendar (PDF supplied by the user).
// Red dates are days off; green dates are additional company holidays.
const RBAC_CALENDARS = {
    2026: {
        source: '2026 RBAC Working Calendar',
        holidays: [
            { start: '01-01', end: '01-03', name: '元旦假期' },
            { start: '02-15', end: '02-23', name: '春节假期' },
            { start: '04-04', end: '04-06', name: '清明假期' },
            { start: '05-01', end: '05-05', name: '劳动节假期' },
            { start: '06-19', end: '06-21', name: '端午假期' },
            { start: '09-25', end: '09-27', name: '中秋假期' },
            { start: '10-01', end: '10-07', name: '国庆假期' }
        ],
        summerHoliday: { start: '08-03', end: '08-05' },
        workingWeekends: ['01-04', '02-14', '02-28', '05-09', '09-20', '10-10']
    }
};
