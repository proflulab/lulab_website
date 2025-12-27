import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

const agreementCopy = {
  zh: {
    title: "用户协议",
    description: "查阅陆向谦实验室的用户协议与服务条款，了解课程、支付与隐私相关说明。",
  },
  en: {
    title: "User Agreement",
    description: "Review Lu Lab's user agreement and terms of service covering courses, payments, and privacy information.",
  },
};

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const copy = agreementCopy[locale as 'zh' | 'en'] ?? agreementCopy.zh;

  return buildPageMetadata({
    locale,
    path: '/agreement.html',
    title: copy.title,
    description: copy.description,
  });
}

export default function AgreementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
