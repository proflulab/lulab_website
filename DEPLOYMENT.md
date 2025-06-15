# 部署指南

## Vercel 部署配置

### 1. 环境变量配置

在 Vercel 项目设置中，需要配置以下环境变量：

#### 必需的环境变量

```bash
# 数据库连接
DATABASE_URL=postgresql://username:password@hostname:port/database

# 认证相关（如果使用 NextAuth.js）
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app

# Stripe 支付（如果使用）
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# 其他 API 密钥
COZE_API_KEY=your-coze-api-key
XIAOE_API_KEY=your-xiaoe-api-key
```

### 2. 在 Vercel 中设置环境变量

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** > **Environment Variables**
4. 添加上述环境变量
5. 确保为 **Production**, **Preview**, 和 **Development** 环境都设置了相应的值

### 3. 数据库设置

如果使用 Neon 数据库：

1. 在 [Neon Console](https://console.neon.tech/) 创建数据库
2. 获取连接字符串
3. 将连接字符串设置为 `DATABASE_URL` 环境变量

### 4. 本地开发

1. 复制 `.env.example` 为 `.env.local`
2. 填入你的环境变量值
3. 运行 `npm run dev`

### 5. 常见问题

#### 构建时数据库连接错误

如果遇到 "No database connection string was provided" 错误：

1. 确认在 Vercel 中设置了 `DATABASE_URL` 环境变量
2. 确认数据库连接字符串格式正确
3. 确认数据库服务正在运行且可访问

#### 依赖警告

构建过程中可能出现的警告：

- `eslint@8.57.1` 已过时：考虑升级到 ESLint v9
- `browserslist` 数据过时：运行 `npx update-browserslist-db@latest`
- 其他过时依赖：定期更新 package.json 中的依赖版本

### 6. 性能优化

- 启用 Next.js 遥测以获得性能洞察
- 定期更新依赖以获得最新的性能改进
- 使用 Vercel Analytics 监控应用性能