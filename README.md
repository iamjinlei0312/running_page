# 🏃‍♂️ Jinlei Running Page

> 个人运动数据可视化页面 | Personal Running Data Visualization

[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-自动同步-brightgreen)](https://github.com/iamjinlei0312/running_page/actions)
[![Website](https://img.shields.io/badge/Website-jinlei.run-blue)](https://jinlei.run)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📊 数据流

```
Apple Watch → Keep → jinlei.run
```

### 🔄 完整数据流程

1. **数据采集**: Apple Watch 记录运动数据
2. **数据同步**: Keep 运动应用同步 Apple Watch 数据
3. **数据提取**: 通过 Keep API 获取运动数据
4. **数据处理**: 生成可视化图表和统计信息
5. **数据展示**: 在 jinlei.run 网站展示

### 🛠️ 技术栈

- **前端**: React + TypeScript + Vite
- **后端**: Python + SQLite
- **部署**: Vercel
- **CI/CD**: GitHub Actions
- **数据源**: Keep API

## 🎯 功能特性

### 📈 数据可视化

- **GitHub 贡献图**: 运动数据以 GitHub 风格展示
- **网格视图**: 按距离分类的运动网格
- **圆形图表**: 年度运动概览
- **月度生命**: 按运动类型分类的生命图表

### 🔄 自动同步

- **定时同步**: 每日自动同步 Keep 数据
- **实时更新**: 新运动数据自动生成图表
- **多平台支持**: 支持多种运动应用数据源

### 📱 响应式设计

- **移动端适配**: 完美支持手机和平板
- **桌面端优化**: 大屏幕显示效果更佳
- **PWA 支持**: 可安装为桌面应用

## 📊 Assets 展示

### 🏃‍♂️ 运动统计图表

#### GitHub 风格贡献图

- **`github.svg`**: 主要运动贡献图
- **`github_2025.svg`**: 2025年运动数据
- **`grid.svg`**: 网格化运动展示

#### 年度统计

- **`year_2022.svg`**: 2022年运动统计
- **`year_2023.svg`**: 2023年运动统计
- **`year_2024.svg`**: 2024年运动统计
- **`year_2025.svg`**: 2025年运动统计

#### 生命图表

- **`mol.svg`**: 总体生命图表
- **`mol_running.svg`**: 跑步生命图表
- **`start.svg`**: 起点标记
- **`end.svg`**: 终点标记

### 🎨 图表样式

#### 颜色方案

- **黄色**: 10km+ 运动
- **红色**: 20km+ 运动
- **绿色**: 5km+ 运动
- **蓝色**: 其他运动

#### 图表类型

- **GitHub 风格**: 按日期排列的运动热力图
- **网格视图**: 按距离分类的运动网格
- **圆形图表**: 年度运动概览
- **生命图表**: 按运动类型分类的生命展示

## 🚀 快速开始

### 环境要求

- Python 3.12+
- Node.js 20+
- pnpm

### 安装依赖

```bash
# 使用 uv 管理 Python 虚拟环境并安装依赖
uv sync

# 激活 Python 虚拟环境 (可选)
source .venv/bin/activate  # Linux/Mac
# 或
.venv\Scripts\activate     # Windows

# 安装 Node.js 依赖
npm install -g corepack && corepack enable
pnpm install
```

### 配置数据源

1. 在 `.github/workflows/run_data_sync.yml` 中设置 `RUN_TYPE`
2. 在 GitHub Secrets 中配置相关 API 密钥
3. 设置个人运动数据参数

### 运行项目

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm serve
```

## 🔧 配置说明

### 环境变量

```yaml
# 运动类型 (支持: keep/strava/nike/garmin/coros/codoon/oppo)
RUN_TYPE: 'keep'

# 个人信息
ATHLETE: 'jinlei0312'
TITLE: 'Jinlei0312 Running'
MIN_GRID_DISTANCE: 10

# 图表配置
GENERATE_MONTH_OF_LIFE: true
BIRTHDAY_MONTH: '1990-03'
```

### GitHub Secrets 配置

```bash
# Keep 配置
KEEP_MOBILE: 'your_mobile'
KEEP_PASSWORD: 'your_password'

# Strava 配置 (可选)
STRAVA_CLIENT_ID: 'your_client_id'
STRAVA_CLIENT_SECRET: 'your_client_secret'
STRAVA_CLIENT_REFRESH_TOKEN: 'your_refresh_token'
```

## 📈 数据同步

### 自动同步

- **定时任务**: 每日 00:00 自动同步
- **触发同步**: 推送代码到 master 分支时自动同步
- **手动同步**: 可在 GitHub Actions 页面手动触发

### 支持的数据源

- ✅ **Keep**: 主要数据源
- ✅ **Strava**: 专业运动平台
- ✅ **Nike**: Nike Run Club
- ✅ **Garmin**: Garmin Connect
- ✅ **Coros**: Coros 运动手表
- ✅ **Codoon**: 咕咚运动
- ✅ **Oppo**: OPPO 健康

## 🌐 部署

### Vercel 部署

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成

### 自定义域名

- **主域名**: [jinlei.run](https://jinlei.run)
- **CDN**: 全球加速访问

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南

1. Fork 本仓库
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 🙏 致谢

- [running_page](https://github.com/yihong0618/running_page) - 原始项目
- [Keep](https://www.gotokeep.com/) - 运动数据源
- [Vercel](https://vercel.com/) - 部署平台

---

<div align="center">

**🏃‍♂️ 让每一次运动都有意义**

[访问网站](https://jinlei.run) | [查看源码](https://github.com/iamjinlei0312/running_page)

</div>
