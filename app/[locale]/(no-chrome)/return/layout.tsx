import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

const returnCopy = {
  zh: {
    title: "支付结果",
    description: "查看陆向谦实验室课程或训练营的支付结果与返回信息。",
  },
  en: {
    title: "Payment Status",
    description: "Review your Lu Lab course or bootcamp payment status and return details.",
  },
};

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const copy = returnCopy[locale as 'zh' | 'en'] ?? returnCopy.zh;

  return buildPageMetadata({
    locale,
    path: '/return',
    title: copy.title,
    description: copy.description,
    noIndex: true,
  });
}

export default function ReturnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
