import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

const checkoutCopy = {
  zh: {
    title: "结账",
    description: "完成陆向谦实验室课程与训练营支付的安全结账页面。",
  },
  en: {
    title: "Checkout",
    description: "Secure checkout for Lu Lab courses and bootcamps.",
  },
};

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const copy = checkoutCopy[locale as 'zh' | 'en'] ?? checkoutCopy.zh;

  return buildPageMetadata({
    locale,
    path: '/checkout',
    title: copy.title,
    description: copy.description,
    noIndex: true,
  });
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
