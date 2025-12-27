import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

const aboutCopy = {
  zh: {
    title: "关于陆向谦实验室",
    description: "了解陆向谦实验室的使命、办学理念、创始人经历与发展历程，探索创新教育的愿景。",
  },
  en: {
    title: "About Lu Lab",
    description: "Learn about Lu Lab's mission, teaching philosophy, founder story, and milestones behind the innovation-focused education lab.",
  },
};

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const copy = aboutCopy[locale as 'zh' | 'en'] ?? aboutCopy.zh;

  return buildPageMetadata({
    locale,
    path: '/about',
    title: copy.title,
    description: copy.description,
  });
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
