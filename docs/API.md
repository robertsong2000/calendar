# 日历应用 API 文档

## 📋 概述

本文档描述了2024年日历应用的API接口和功能说明。

## 🎯 核心类和方法

### CalendarApp 类

主应用类，提供日历显示和交互功能。

#### 构造函数
```javascript
new CalendarApp()
```

#### 主要方法

##### getWeekOfYear(date)
计算给定日期是本年度的第几周（基于ISO 8601标准）。

**参数：**
- `date` (Date): 要计算的日期对象

**返回值：**
- `number`: 周数（1-53）

**示例：**
```javascript
const app = new CalendarApp();
const week = app.getWeekOfYear(new Date(2024, 0, 15)); // 返回 3
```

##### getDaysInMonth(year, month)
获取指定月份的天数。

**参数：**
- `year` (number): 年份
- `month` (number): 月份（0-11）

**返回值：**
- `number`: 天数（28-31）

**示例：**
```javascript
const days = app.getDaysInMonth(2024, 1); // 返回 29（闰年2月）
```

##### getFirstDayOfMonth(year, month)
获取指定月份第一天是星期几。

**参数：**
- `year` (number): 年份
- `month` (number): 月份（0-11）

**返回值：**
- `number`: 星期几（0-6，0表示星期日）

**示例：**
```javascript
const firstDay = app.getFirstDayOfMonth(2024, 0); // 返回 1（星期一）
```

##### formatMonthYear(date)
格式化日期为中文年月格式。

**参数：**
- `date` (Date): 要格式化的日期

**返回值：**
- `string`: 格式化的字符串（如"2024年 一月"）

##### renderCalendar()
渲染当前月份的日历到页面。

##### previousMonth() / nextMonth()
切换到上个月/下个月。

## 🧪 测试接口

### CalendarTestSuite 类

测试套件类，提供单元测试功能。

#### 主要测试方法

##### testWeekCalculation()
测试周数计算的准确性。

**测试用例：**
- 2024年1月1日：第1周
- 2024年1月8日：第2周
- 2024年12月30日：第52周

##### testDateHandling()
测试日期处理功能。

**测试用例：**
- 各月份天数计算
- 闰年2月天数（29天）
- 月份第一天计算

##### testResponsiveLayout()
测试响应式布局适配。

##### testEdgeCases()
测试边界条件处理。

## 🎨 样式接口

### CSS 类名规范

#### 布局类
- `.container`: 主容器
- `.calendar-container`: 日历容器
- `.calendar`: 日历网格

#### 元素类
- `.day-cell`: 日期单元格
- `.day-number`: 日期数字
- `.week-info`: 周数信息
- `.weekday-header`: 星期标题

#### 状态类
- `.today`: 今日高亮
- `.other-month`: 其他月份
- `.test-pass`: 测试通过
- `.test-fail`: 测试失败

## 📱 响应式断点

| 屏幕宽度 | 布局变化 |
|---------|----------|
| ≥1200px | 桌面布局，完整显示 |
| ≥768px  | 平板布局，适当缩小 |
| <768px  | 手机布局，紧凑显示 |

## 🔄 事件接口

### DOM 事件

#### 按钮点击事件
- `prevMonth`: 切换到上个月
- `nextMonth`: 切换到下个月

#### 日期点击事件
- `day-cell`: 显示日期详细信息

### 自定义事件

#### calendar:rendered
日历渲染完成时触发。

#### calendar:monthChanged
月份切换时触发。

## 📊 性能指标

### 加载性能
- 首次加载时间：< 1秒
- 资源大小：< 50KB
- 缓存策略：静态资源缓存1年

### 运行性能
- 月份切换延迟：< 100ms
- 内存使用：< 10MB
- CPU使用：< 5%

## 🛠️ 配置选项

### 可配置参数

```javascript
const config = {
    // 主题配置
    theme: {
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        backgroundColor: '#f8f9fa'
    },
    
    // 语言配置
    language: 'zh-CN',
    
    // 显示配置
    showWeekNumbers: true,
    highlightToday: true,
    
    // 交互配置
    enableClickEvents: true,
    enableKeyboardNavigation: true
};
```

## 🐛 调试接口

### 控制台调试

```javascript
// 开启调试模式
window.DEBUG = true;

// 查看日历状态
console.log(app.currentDate);
console.log(app.currentMonth);
console.log(app.currentYear);

// 测试周数计算
const testDate = new Date(2024, 0, 15);
console.log(`测试日期: ${testDate}`);
console.log(`周数: ${app.getWeekOfYear(testDate)}`);
```

### 错误处理

所有方法都包含错误处理机制：

```javascript
try {
    const week = app.getWeekOfYear(invalidDate);
} catch (error) {
    console.error('日期计算错误:', error.message);
}
```

## 🔧 扩展接口

### 自定义渲染

可以通过继承扩展功能：

```javascript
class CustomCalendar extends CalendarApp {
    renderCalendar() {
        super.renderCalendar();
        // 添加自定义渲染逻辑
    }
}
```

### 插件系统

支持插件式扩展：

```javascript
class CalendarPlugin {
    install(calendar) {
        // 插件安装逻辑
    }
}
```

## 📋 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2024-01-01 | 初始版本 |
| 1.0.1 | 2024-01-02 | 添加测试接口 |
| 1.0.2 | 2024-01-03 | 优化性能 |

## 🔗 相关链接

- [项目仓库](https://github.com/your-repo/calendar-app)
- [在线演示](https://your-demo.com/calendar)
- [问题反馈](https://github.com/your-repo/issues)