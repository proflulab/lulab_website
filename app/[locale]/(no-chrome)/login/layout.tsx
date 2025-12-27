import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

const loginCopy = {
  zh: {
    title: "登录",
    description: "登录陆向谦实验室账户，访问管理后台或个人学习进度。",
  },
  en: {
    title: "Sign In",
    description: "Sign in to your Lu Lab account to access the admin console or your learning progress.",
  },
};

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const copy = loginCopy[locale as 'zh' | 'en'] ?? loginCopy.zh;

  return buildPageMetadata({
    locale,
    path: '/login',
    title: copy.title,
    description: copy.description,
    noIndex: true,
  });
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
