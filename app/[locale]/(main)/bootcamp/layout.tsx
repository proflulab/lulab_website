import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

const bootcampCopy = {
  zh: {
    title: "训练营项目",
    description: "加入陆向谦实验室训练营，参与AI、编程与产品实战项目，获得导师辅导与团队协作体验。",
  },
  en: {
    title: "Bootcamp Programs",
    description: "Join Lu Lab bootcamps to work on AI, coding, and product projects with mentors, team practice, and industry-grade workflows.",
  },
};

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const copy = bootcampCopy[locale as 'zh' | 'en'] ?? bootcampCopy.zh;

  return buildPageMetadata({
    locale,
    path: '/bootcamp',
    title: copy.title,
    description: copy.description,
  });
}

export default function BootcampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
