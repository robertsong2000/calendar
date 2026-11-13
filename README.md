# 2024年日历应用 - 周数查询工具

一个美观、实用的网页日历应用，显示每一天是本年度的第几周。

## 🌟 功能特点

- 📅 **完整日历显示** - 展示2024年每个月的完整日历
- 📊 **周数计算** - 每一天都标注了是本年度的第几周（基于ISO 8601标准）
- 🔄 **月份导航** - 轻松切换查看不同月份的日历
- 🎯 **今日高亮** - 当前日期会特殊高亮显示
- 📱 **响应式设计** - 在手机、平板和电脑上都能完美显示
- 🎨 **美观界面** - 现代渐变设计风格，支持深色模式
- ⚡ **快速加载** - 纯前端应用，无需服务器支持

## 🚀 快速开始

### RBAC 班休安排

- “RBAC 班休”默认开启，浏览器会记住开关选择。
- 红色“休”表示休息或假期，蓝色“班”表示调休补班，绿色“夏休”表示公司额外假期。
- 月份下显示工作日和夏休天数；今日信息、日期详情显示当天班休说明。
- 当前数据来自用户提供的《2026 RBAC Working Calendar》PDF，仅适用于 RBAC 2026 年；其他年份显示暂无安排。
- `rbac-2026.js` 独立保存安排。2026 年全年 245 个工作日，夏休为 8 月 3—5 日。

已安装 Playwright 和 Chrome 的环境可运行 `node tests/rbac.test.cjs`，核对 PDF 月度/年度统计、补班日期、开关持久化和移动端布局。

### 方法1：本地直接打开
1. 下载项目文件
2. 双击 `index.html` 文件即可在浏览器中打开

### 方法2：使用本地服务器
```bash
# 使用Python
python3 -m http.server 8000

# 使用Node.js
npx serve .

# 使用PHP
php -S localhost:8000
```

### 方法3：使用Docker
```bash
# 构建镜像
docker build -t calendar-app .

# 运行容器
docker run -p 8080:80 calendar-app

# 或使用docker-compose
docker-compose up
```

## 🛠️ 技术栈

- **HTML5** - 语义化结构
- **CSS3** - 现代样式设计（Flexbox/Grid）
- **JavaScript ES6+** - 交互逻辑
- **响应式设计** - 移动端优先
- **Docker** - 容器化部署

## 📁 项目结构

```
calendar/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── calendar.js         # 日历逻辑
├── README.md           # 项目文档
├── Dockerfile          # Docker镜像配置
├── docker-compose.yml  # Docker Compose配置
├── tests/              # 测试文件
│   ├── test.html       # 测试页面
│   └── test.js         # 测试脚本
└── docs/               # 额外文档
    └── API.md          # API文档
```

## 🧪 测试

项目包含完整的测试套件：

### 运行测试
1. 打开 `tests/test.html` 文件
2. 查看测试结果
3. 或运行自动化测试脚本

### 测试内容
- ✅ 周数计算准确性
- ✅ 日期边界条件
- ✅ 响应式布局
- ✅ 跨浏览器兼容性
- ✅ 性能测试

## 🎨 界面预览

### 桌面端
- 完整的月历视图
- 清晰的周数标注
- 优雅的渐变背景

### 移动端
- 自适应网格布局
- 触摸友好的交互
- 优化的字体大小

## 🔄 浏览器支持

- ✅ Chrome (最新版)
- ✅ Firefox (最新版)
- ✅ Safari (最新版)
- ✅ Edge (最新版)
- ✅ 移动端浏览器

## 📊 性能优化

- 轻量级代码 (~50KB)
- 无外部依赖
- 快速加载
- 内存优化

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙋‍♂️ 联系方式

如有问题或建议，欢迎联系：
- 提交 [Issue](https://github.com/your-repo/issues)
- 发送邮件：your-email@example.com

## 🔄 更新日志

### v1.0.0 (2024-01-01)
- ✨ 初始版本发布
- 📅 完整日历功能
- 📊 周数计算功能
- 🎨 响应式设计
- 🧪 测试套件
- 🐳 Docker支持
