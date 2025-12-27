import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

const adminCopy = {
  zh: {
    title: "管理后台",
    description: "陆向谦实验室管理后台入口，仅供授权用户访问。",
  },
  en: {
    title: "Admin Console",
    description: "Lu Lab admin console for authorized users only.",
  },
};

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const copy = adminCopy[locale as 'zh' | 'en'] ?? adminCopy.zh;

  return buildPageMetadata({
    locale,
    path: '/admin',
    title: copy.title,
    description: copy.description,
    noIndex: true,
  });
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
