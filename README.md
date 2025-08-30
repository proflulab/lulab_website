# 陆向谦实验室官方网站

> 打造没有围墙的网上"斯坦福大学"

这是陆向谦实验室的官方网站，基于 [Next.js 14](https://nextjs.org) 构建，采用现代化的技术栈和创新的教育理念，为全球学习者提供优质的在线教育体验。

## 🌟 项目特色

- **🌍 国际化支持**: 支持中英文双语切换，面向全球用户
- **🎨 现代化UI**: 基于 Tailwind CSS 和 shadcn/ui 组件库，提供优雅的用户界面
- **🔐 用户认证**: 集成 NextAuth.js，支持多种登录方式
- **💳 支付集成**: 集成 Stripe 支付系统，支持在线课程购买
- **📱 响应式设计**: 完美适配桌面端、平板和移动设备
- **⚡ 高性能**: 基于 Next.js 14 App Router，提供极致的用户体验
- **🎯 项目式学习**: 支持训练营、课程、俱乐部等多种学习模式

## 🛠️ 技术栈

### 前端框架

- **Next.js 14** - React 全栈框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Framer Motion** - 动画库

### UI 组件

- **shadcn/ui** - 现代化组件库
- **Radix UI** - 无障碍的原始组件
- **Material-UI** - Google Material Design 组件
- **NextUI** - 现代化 React UI 库

### 状态管理与数据

- **NextAuth.js** - 身份验证解决方案
- **Neon Database** - 现代化 PostgreSQL 数据库
- **Stripe** - 支付处理平台

### 国际化与内容

- **next-intl** - 国际化解决方案
- **React Markdown** - Markdown 渲染
- **Gray Matter** - Markdown 前置数据解析

### 3D 与可视化

- **Three.js** - 3D 图形库
- **React Three Fiber** - React 的 Three.js 渲染器
- **Recharts** - 数据可视化图表库

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm、yarn、pnpm 或 bun 包管理器

### 安装依赖

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 环境配置

在项目根目录创建 `.env.local` 文件，并配置以下环境变量：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth 配置
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# 数据库配置
DATABASE_URL=your_neon_database_url

# Stripe 配置
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# 邮件配置
EMAIL_SERVER_HOST=your_email_host
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email_user
EMAIL_SERVER_PASSWORD=your_email_password
EMAIL_FROM=your_email_from
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```text
lulab_website_next_js/
├── app/                    # Next.js 14 App Router
│   ├── [locale]/          # 国际化路由
│   │   ├── (main)/        # 主要页面布局
│   │   ├── (navbar-only)/ # 仅导航栏布局
│   │   └── (no-chrome)/   # 无装饰布局
│   ├── api/               # API 路由
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── ui/                # UI 基础组件
│   ├── sections/          # 页面区块组件
│   ├── navbar/            # 导航栏组件
│   ├── admin/             # 管理后台组件
│   └── ...
├── lib/                   # 工具库
│   ├── db/                # 数据库相关
│   ├── utils.ts           # 通用工具函数
│   └── stripe.ts          # Stripe 配置
├── messages/              # 国际化消息文件
│   ├── zh.json            # 中文
│   └── en.json            # 英文
├── public/                # 静态资源
│   ├── images/            # 图片资源
│   ├── videos/            # 视频资源
│   └── md/                # Markdown 文件
├── types/                 # TypeScript 类型定义
└── hooks/                 # 自定义 React Hooks
```

## 🎯 主要功能模块

### 🏠 首页

- 实验室介绍和理念展示
- 英雄区块和特色展示
- 响应式设计和动画效果

### 📖 关于我们

- 创始人陆向谦教授介绍
- 办学理念和教育哲学
- 发展历程时间线

### 🎓 训练营

- 项目式学习展示
- 课程报名和支付
- 学习进度跟踪

### 🏛️ 俱乐部

- 学习社区功能
- 成员互动交流
- 活动组织管理

### 👨‍💼 管理后台

- 用户管理
- 内容管理
- 数据统计分析

## 🌐 国际化

项目支持中英文双语：

- 中文：`/zh/*`
- 英文：`/en/*`

语言文件位于 `messages/` 目录下，使用 `next-intl` 进行管理。

## 🔧 开发指南

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 TypeScript 严格模式
- 组件采用函数式编程

### 样式规范

- 使用 Tailwind CSS 实用类
- 组件样式模块化
- 响应式设计优先

### 提交规范

- 使用语义化提交信息
- 代码提交前进行 lint 检查

## 📦 构建和部署

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm run start
```

### 部署到 Vercel

推荐使用 [Vercel Platform](https://vercel.com/new) 进行部署，它是 Next.js 的创建者提供的平台。

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 自动部署完成

## 🤝 贡献指南

我们欢迎社区贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用私有许可证。版权所有 © 2024 陆向谦实验室。

## 📞 联系我们

- **邮箱**: <info@lulabs.org>
- **电话**: 010-12345678
- **地址**: 305 Pacific View Dr, Pacifica, CA 94044, USA
- **官网**: [陆向谦实验室](https://lulabs.org)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和陆向谦实验室的全体成员。

---

**陆向谦实验室** - 培养具备全球视野与创新精神的复合型人才
