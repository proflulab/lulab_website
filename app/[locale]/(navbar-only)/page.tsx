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
import CozeChat from "@/components/CozeChat";

const Home: React.FC = () => {


  return (
    <>
      <Hero />
      <CozeChat />
    </>
  );
};

export default Home;
