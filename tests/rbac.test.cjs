// Run with: node tests/rbac.test.cjs (requires Playwright and Chrome).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const sandbox = vm.createContext({
    console, Date, Map, Set,
    document: { getElementById: () => null, addEventListener() {} },
    window: { addEventListener() {} }
});
for (const file of ['lunar.min.js', 'rbac-2026.js', 'calendar.js', 'tests/test.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
}
vm.runInContext('testSuite.testWeekCalculation(); testSuite.testDateHandling(); testSuite.testEdgeCases();', sandbox);
assert.equal(vm.runInContext('testSuite.failedTests', sandbox), 0);
const app = vm.runInContext('new CalendarApp()', sandbox);
const expected = [21, 16, 22, 21, 19, 21, 23, 18, 22, 18, 21, 23];
const actual = expected.map((_, month) => app.getRbacMonthStats(2026, month).working);
assert.deepEqual(actual, expected);
assert.equal(actual.reduce((a, b) => a + b), 245);
assert.equal(app.getRbacMonthStats(2026, 7).summer, 3);
assert.equal(app.getRbacMonthStats(2027, 0), null);
for (const [month, day] of [[1, 4], [2, 14], [2, 28], [5, 9], [9, 20], [10, 10]]) {
    assert.equal(app.getRbacInfo(new Date(2026, month - 1, day)).type, 'makeup');
}
assert.equal(app.getRbacInfo(new Date(2026, 8, 24)).working, true);
assert.equal(app.getRbacInfo(new Date(2026, 7, 6)).working, true);
console.log('Date, ISO week and PDF monthly/annual totals passed.');

(async () => {
    const server = http.createServer((req, res) => {
        const name = new URL(req.url, 'http://localhost').pathname;
        const file = path.join(root, name === '/' ? 'index.html' : name);
        if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
        fs.readFile(file, (err, data) => {
            if (err) { res.writeHead(404).end(); return; }
            const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
            res.setHeader('Content-Type', mime[path.extname(file)] || 'text/plain');
            res.end(data);
        });
    });
    let browser;
    try {
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
        browser = await chromium.launch({ channel: 'chrome', headless: true });
        const page = await browser.newPage({ viewport: { width: 1000, height: 1100 } });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.route('https://fonts.googleapis.com/**', route => route.abort());
        await page.clock.install({ time: new Date(2026, 7, 3, 12) });
        await page.goto(`http://127.0.0.1:${server.address().port}/`);
        const cell = date => page.locator(`[data-date="${date}"]`);
        assert.equal(await page.locator('#rbacToggle').isChecked(), true);
        assert.match(await page.locator('#rbacMonthSummary').innerText(), /工作日 18 天 · 公司夏休 3 天/);
        assert.equal(await cell('2026-08-03').locator('.day-badge').innerText(), '夏休');
        assert.match(await page.locator('#todayInfo').innerText(), /公司额外假期 · 夏休/);
        await cell('2026-08-03').click();
        assert.match(await page.locator('#selectedDayInfo').innerText(), /公司额外假期 · 夏休/);
        await page.locator('#rbacToggle').uncheck();
        assert.equal(await page.locator('.day-badge').count(), 0);
        assert.equal(await page.locator('#rbacMonthSummary').isVisible(), false);
        assert.equal(await page.locator('#rbacLegend').isVisible(), false);
        assert.doesNotMatch(await page.locator('#selectedDayInfo').innerText(), /RBAC|夏休/);
        assert.doesNotMatch(await page.locator('#todayInfo').innerText(), /RBAC|夏休/);
        await page.reload();
        assert.equal(await page.locator('#rbacToggle').isChecked(), false);
        await page.locator('#rbacToggle').check();
        await page.reload();
        assert.equal(await page.locator('#rbacToggle').isChecked(), true);
        await page.locator('#nextMonth').click();
        assert.equal(await cell('2026-09-20').locator('.day-badge').innerText(), '班');
        assert.equal(await cell('2026-09-25').locator('.day-badge').innerText(), '休');
        assert.equal(await cell('2026-09-25').locator('.culture-label').innerText(), '中秋');
        await cell('2026-09-20').click();
        assert.match(await page.locator('#selectedDayInfo').innerText(), /调休补班日/);
        for (let i = 0; i < 4; i++) await page.locator('#nextMonth').click();
        assert.match(await page.locator('#rbacMonthSummary').innerText(), /暂无 2027 年/);
        assert.equal(await page.locator('.day-cell:not(.other-month) .day-badge').count(), 0);
        await page.locator('#todayBtn').click();
        assert.equal(await page.locator('#selectedDayInfo').isVisible(), false);
        for (const width of [1000, 375, 320]) {
            await page.setViewportSize({ width, height: 1100 });
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
            assert.equal(overflow, false, `No overflow at ${width}px`);
            const overlap = await cell('2026-08-03').evaluate(el => {
                const badge = el.querySelector('.day-badge').getBoundingClientRect();
                const number = el.querySelector('.day-number').getBoundingClientRect();
                return badge.bottom > number.top;
            });
            assert.equal(overlap, false, `No badge overlap at ${width}px`);
            await page.screenshot({ path: `/tmp/rbac-calendar-${width}.png`, fullPage: true });
        }
        assert.deepEqual(errors, []);
        const blocked = await browser.newPage();
        await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', {
            get() { throw new Error('Storage blocked'); }
        }));
        await blocked.goto(`http://127.0.0.1:${server.address().port}/`);
        await blocked.locator('#rbacToggle').uncheck();
        assert.equal(await blocked.locator('.day-badge').count(), 0);
        console.log('Browser checks passed: badges, details, toggle persistence, year boundary, storage fallback, 3 viewport sizes.');
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
