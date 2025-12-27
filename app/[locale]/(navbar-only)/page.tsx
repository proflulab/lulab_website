/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-09-10 01:59:14
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-12-03 17:10:49
 * @FilePath: /lulab_website_next_js/app/[locale]/page.tsx
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */


import React from "react";
import { Hero } from "@/components/sections/Hero";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

const homeCopy = {
  zh: {
    title: "陆向谦实验室首页",
    description: "陆向谦实验室以项目式学习与全球导师网络，帮助学员在真实项目中探索创新、创业与职业发展。",
  },
  en: {
    title: "Lu Lab Home",
    description: "Lu Lab blends project-based learning with a global mentor network to help students grow through real-world innovation and entrepreneurship projects.",
  },
};

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const copy = homeCopy[locale as 'zh' | 'en'] ?? homeCopy.zh;

  return buildPageMetadata({
    locale,
    path: '/',
    title: copy.title,
    description: copy.description,
  });
}

const Home: React.FC = () => {


  return (
    <>
      <Hero />
    </>
  );
};

export default Home;
