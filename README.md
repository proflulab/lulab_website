This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 环境变量配置

在开始开发之前，请先配置环境变量：

1. 复制 `.env.example` 文件为 `.env.local`
2. 填入你的环境变量值，特别是 `DATABASE_URL`
3. 确保数据库连接正常

详细的部署配置请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)。

## Getting Started

First, run the development server:

## Precautions

Before running the project, you need to create a ".env.local" file in the root directory of the project and put the following two information in it：

```bash
NEXT_PUBLIC_SUPABASE_URL=The URL of your supabase project
NEXT_PUBLIC_SUPABASE_ANON_KEY=APIKEY of the supabase project
```

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
