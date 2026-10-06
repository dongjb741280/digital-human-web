# digital-human-web

AI 数字人 Web 前端项目（应用标题：**AI 数字人**），基于 [vue-element-plus-admin](https://gitee.com/kailong110120130/vue-element-plus-admin) / [芋道（yudao）](https://github.com/YunaiV/ruoyi-vue-pro) 中后台模板二次开发，面向数字人内容生产场景，提供数字人形象、声音、文案、视频的「制作 - 管理 - 互动 - 直播」全链路能力。

## 功能特性

### 数字人核心能力

| 模块 | 说明 |
| ------ | ------ |
| 创作空间 | 数字人内容创作主工作台，集成导航、工具栏、作品与素材资源 |
| 视频管理 / 视频制作 | 数字人视频的列表管理与在线制作 |
| 数字人管理 | 数字人形象的创建与管理（`CreateDigitalAvatar`） |
| 声音管理 / 声音制作 | 声音克隆与声音资产管理 |
| 文案制作 / 文案管理 | 文案的 AI 生成、编辑与管理，支持 PPT 大纲生成 |
| PPT 制作 / ppt-master | PPT 一键生成：`ppt-prod`（9 版式向导）+ `ppt-master`（原生可编辑 .pptx，菜单「ppt-master」）；三处（制作页 / 文案列表 / ppt-master）均支持 **Collabora 在线编辑**（`ppt-collabora` 全屏页内嵌 CODE） |
| 数字人互动 | 基于 WebRTC + 流式对话（SSE）的实时数字人互动（含 H5 端） |
| 直播 | 数字人直播的列表、详情与观看 |
| AI 训练视频 | AI 训练视频的详情、基础信息、视频与观看记录 |

### AI 能力

- AI 对话（chat）：会话与消息管理
- AI 写作（writer）、AI 图像（image）、AI 音乐（music）
- 模型管理：API Key、对话模型、对话角色配置

### 其他

- H5 端：直播（`live-video` / `live-notice`）、课程（`training-lesson`）
- 视频工作台（studio）：视频、课程、通知、播放器
- 系统管理：字典、站内信等（继承自 yudao 模板）

## 技术栈

| 技术 | 说明 | 版本 |
| ------ | ------ | ------ |
| [Vue](https://vuejs.org/) | 前端框架 | 3.4.21 |
| [Vite](https://vitejs.dev/) | 构建工具 | 5.1.4 |
| [TypeScript](https://www.typescriptlang.org/) | JS 超集 | 5.3.3 |
| [Element Plus](https://element-plus.org/) | UI 组件库 | 2.7.0 |
| [Pinia](https://pinia.vuejs.org/) | 状态管理 | 2.1.7 |
| [Vue Router](https://router.vuejs.org/) | 路由 | 4.3.0 |
| [vue-i18n](https://vue-i18n.intlify.dev/) | 国际化 | 9.10.2 |
| [UnoCSS](https://unocss.dev/) | 原子化 CSS | 0.58.5 |
| [ECharts](https://echarts.apache.org/) | 图表 | 5.5.0 |
| [WebRTC](https://webrtc.org/) | 实时音视频（webrtc-adapter） | 9.0.1 |
| [fetch-event-source](https://github.com/Azure/fetch-event-source) | SSE 流式对话 | 2.0.1 |
| [Fabric.js](http://fabricjs.com/) | Canvas 画布 | 5.2.1 |
| [Konva](https://konvajs.org/) | 2D Canvas 图形 | 9.3.14 |
| [Axios](https://axios-http.com/) | HTTP 客户端 | 1.6.8 |

## 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.6.0（强制使用 pnpm）

## 快速开始

```bash
# 安装依赖
pnpm install

# 本地开发（使用 .env.local 环境配置）
pnpm dev

# 开发环境（使用 .env.dev 环境配置）
pnpm dev-server
```

### 构建

```bash
pnpm build:local   # 本地构建
pnpm build:dev     # 开发环境
pnpm build:test    # 测试环境
pnpm build:stage   # 预发布环境
pnpm build:prod    # 生产环境
pnpm build:app     # App 打包环境
```

### 其他命令

```bash
pnpm ts:check     # TypeScript 类型检查
pnpm lint:eslint  # ESLint 检查并自动修复
pnpm lint:format  # Prettier 格式化
pnpm lint:style   # Stylelint 检查并自动修复
pnpm preview      # 本地构建并预览
```

## 环境配置

项目通过 `.env.*` 文件区分不同环境，构建时通过 `--mode` 指定：

| 文件 | 说明 |
| ------ | ------ |
| `.env` | 公共配置（标题、端口、租户/验证码开关等） |
| `.env.local` | 本地开发环境 |
| `.env.dev` | 开发环境 |
| `.env.test` | 测试环境 |
| `.env.stage` | 预发布环境 |
| `.env.prod` | 生产环境 |
| `.env.app` | App 打包环境 |

关键变量：

| 变量 | 说明 |
| ------ | ------ |
| `VITE_APP_TITLE` | 应用标题 |
| `VITE_PORT` | 本地开发端口 |
| `VITE_BASE_URL` | 后端接口地址（数字人服务） |
| `VITE_UPLOAD_URL` | 文件上传地址 |
| `VITE_API_URL` | 接口前缀（默认 `/admin-api`） |
| `VITE_BASE_PATH` | 打包资源基础路径 |
| `VITE_OUT_DIR` | 构建输出目录 |

> 数字人业务接口统一走 `VITE_BASE_URL + /digital-api/system` 前缀（见 `src/api/digital`）。

## 项目结构

```text
digital-human-web
├── build/                  # Vite 构建配置
├── packages/               # pnpm workspace 本地包（@editor/core 编辑器核心）
├── public/                 # 静态资源
├── src/
│   ├── api/                # 接口层（ai / digital / editor / h5 / infra / system / login）
│   ├── assets/             # 静态资源（字体、图片、SVG 等）
│   ├── components/         # 通用组件（二次封装）
│   ├── config/axios/       # Axios 请求封装
│   ├── directives/         # 自定义指令（权限等）
│   ├── hooks/              # 组合式函数
│   ├── layout/             # 布局组件
│   ├── locales/            # 国际化（zh-CN / en）
│   ├── plugins/            # 插件（elementPlus / echarts / vueI18n / unocss 等）
│   ├── router/             # 路由
│   ├── store/              # Pinia 状态
│   ├── styles/             # 全局样式
│   ├── utils/              # 工具函数
│   └── views/
│       ├── ai/             # AI 能力（对话、写作、图像、音乐、模型管理）
│       ├── digital/        # 数字人核心（视频、创作空间、互动、直播、文案等）
│       ├── editor/         # 编辑器
│       ├── h5/             # H5 端（直播、课程）
│       ├── infra/          # 基础设施（代码生成、定时任务等）
│       ├── studio/         # 视频工作台
│       └── system/         # 系统管理
├── types/                  # 类型声明
├── uno.config.ts           # UnoCSS 配置
├── vite.config.ts          # Vite 配置
└── pnpm-workspace.yaml     # pnpm 工作区配置
```

## 后端

本项目为纯前端仓库，依赖数字人后端服务提供接口（接口前缀 `/digital-api` 与 `/admin-api`）。数字人服务地址通过 `VITE_BASE_URL` 配置。
