import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

const courseCopy = {
  zh: {
    title: "课程精选",
    description: "浏览并购买陆向谦实验室的精选课程，支持在线支付与多设备学习体验。",
  },
  en: {
    title: "Featured Courses",
    description: "Explore Lu Lab's featured courses and purchase online with a seamless, multi-device learning experience.",
  },
};

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const copy = courseCopy[locale as 'zh' | 'en'] ?? courseCopy.zh;

  return buildPageMetadata({
    locale,
    path: '/course',
    title: copy.title,
    description: copy.description,
  });
}

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
