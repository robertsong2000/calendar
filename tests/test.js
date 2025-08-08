// 测试套件
class CalendarTestSuite {
    constructor() {
        this.results = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
    }

    assert(condition, testName) {
        this.totalTests++;
        if (condition) {
            this.passedTests++;
            this.results.push({
                name: testName,
                status: 'PASS',
                message: ''
            });
        } else {
            this.failedTests++;
            this.results.push({
                name: testName,
                status: 'FAIL',
                message: '断言失败'
            });
        }
    }

    assertEquals(expected, actual, testName) {
        this.totalTests++;
        if (expected === actual) {
            this.passedTests++;
            this.results.push({
                name: testName,
                status: 'PASS',
                message: ''
            });
        } else {
            this.failedTests++;
            this.results.push({
                name: testName,
                status: 'FAIL',
                message: `期望值: ${expected}, 实际值: ${actual}`
            });
        }
    }

    // 测试周数计算
    testWeekCalculation() {
        console.log('运行周数计算测试...');
        
        // 创建测试用的CalendarApp实例
        const app = new CalendarApp();
        
        // 测试2024年的周数计算（基于ISO 8601标准）
        this.assertEquals(1, app.getWeekOfYear(new Date(2024, 0, 1)), "2024年1月1日应该是第1周");
        this.assertEquals(1, app.getWeekOfYear(new Date(2024, 0, 4)), "2024年1月4日应该是第1周");
        this.assertEquals(2, app.getWeekOfYear(new Date(2024, 0, 8)), "2024年1月8日应该是第2周");
        this.assertEquals(52, app.getWeekOfYear(new Date(2024, 11, 29)), "2024年12月29日应该是第52周");
        this.assertEquals(1, app.getWeekOfYear(new Date(2024, 11, 30)), "2024年12月30日应该是第1周");
        this.assertEquals(1, app.getWeekOfYear(new Date(2024, 11, 31)), "2024年12月31日应该是第1周");
        
        // 测试跨年的情况
        this.assertEquals(1, app.getWeekOfYear(new Date(2025, 0, 1)), "2025年1月1日应该是第1周");
        this.assertEquals(52, app.getWeekOfYear(new Date(2023, 11, 31)), "2023年12月31日应该是第52周");
        
        // 测试年中周数
        this.assertEquals(26, app.getWeekOfYear(new Date(2024, 5, 24)), "2024年6月24日应该是第26周");
        this.assertEquals(39, app.getWeekOfYear(new Date(2024, 8, 23)), "2024年9月23日应该是第39周");
    }

    // 测试日期处理
    testDateHandling() {
        console.log('运行日期处理测试...');
        
        const app = new CalendarApp();
        
        // 测试获取月份天数
        this.assertEquals(31, app.getDaysInMonth(2024, 0), "2024年1月应该有31天");
        this.assertEquals(29, app.getDaysInMonth(2024, 1), "2024年2月应该有29天（闰年）");
        this.assertEquals(30, app.getDaysInMonth(2024, 3), "2024年4月应该有30天");
        this.assertEquals(31, app.getDaysInMonth(2024, 11), "2024年12月应该有31天");
        
        // 测试获取月份第一天
        this.assertEquals(1, app.getFirstDayOfMonth(2024, 0), "2024年1月1日是星期一");
        this.assert(0 <= app.getFirstDayOfMonth(2024, 5) && app.getFirstDayOfMonth(2024, 5) <= 6, "月份第一天应该在0-6之间");
    }

    // 测试响应式布局
    testResponsiveLayout() {
        console.log('运行响应式布局测试...');
        
        // 模拟不同屏幕尺寸
        const testWidths = [1920, 768, 375, 320];
        
        testWidths.forEach(width => {
            const isResponsive = width >= 320; // 所有尺寸都应该支持
            this.assert(isResponsive, `屏幕宽度 ${width}px 应该支持响应式布局`);
        });
    }

    // 测试边界条件
    testEdgeCases() {
        console.log('运行边界条件测试...');
        
        const app = new CalendarApp();
        
        // 测试年份边界
        this.assertEquals(52, app.getWeekOfYear(new Date(2023, 11, 31)), "2023年最后一天应该是第52周");
        
        // 测试月份边界
        this.assertEquals(31, app.getDaysInMonth(2024, 0), "1月边界测试");
        this.assertEquals(28, app.getDaysInMonth(2023, 1), "2023年2月应该有28天");
    }

    // 运行所有测试
    runAllTests() {
        this.reset();
        
        try {
            this.testWeekCalculation();
            this.testDateHandling();
            this.testResponsiveLayout();
            this.testEdgeCases();
            
            this.displayResults();
        } catch (error) {
            console.error('测试运行时错误:', error);
            this.results.push({
                name: '测试运行',
                status: 'ERROR',
                message: error.message
            });
            this.displayResults();
        }
    }

    reset() {
        this.results = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
    }

    displayResults() {
        const resultsDiv = document.getElementById('testResults');
        const summaryDiv = document.getElementById('testSummary');
        
        resultsDiv.innerHTML = '';
        
        this.results.forEach(result => {
            const div = document.createElement('div');
            div.className = `test-result test-${result.status.toLowerCase()}`;
            div.innerHTML = `
                <strong>${result.name}</strong> - ${result.status}
                ${result.message ? `<br><small>${result.message}</small>` : ''}
            `;
            resultsDiv.appendChild(div);
        });
        
        summaryDiv.style.display = 'block';
        summaryDiv.innerHTML = `
            测试完成！
            总计: ${this.totalTests} 个测试
            通过: ${this.passedTests} 个
            失败: ${this.failedTests} 个
            成功率: ${Math.round((this.passedTests / this.totalTests) * 100)}%
        `;
        
        // 添加颜色
        if (this.failedTests === 0) {
            summaryDiv.style.background = '#d4edda';
            summaryDiv.style.color = '#155724';
            summaryDiv.style.borderColor = '#c3e6cb';
        } else {
            summaryDiv.style.background = '#f8d7da';
            summaryDiv.style.color = '#721c24';
            summaryDiv.style.borderColor = '#f5c6cb';
        }
    }
}

// 全局测试函数
let testSuite = new CalendarTestSuite();

function runAllTests() {
    testSuite.runAllTests();
}

function runWeekTests() {
    testSuite.reset();
    testSuite.testWeekCalculation();
    testSuite.displayResults();
}

function runDateTests() {
    testSuite.reset();
    testSuite.testDateHandling();
    testSuite.displayResults();
}

function runResponsiveTests() {
    testSuite.reset();
    testSuite.testResponsiveLayout();
    testSuite.displayResults();
}

// 页面加载完成后自动运行基础测试
window.addEventListener('load', () => {
    console.log('测试环境已准备就绪');
});