/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-11-22 20:48:10
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-12-28 18:55:57
 * @FilePath: /lulab_website_next_js/next.config.mjs
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */

// ... existing code ...

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wechatapppro-1252524126.cos.ap-shanghai.myqcloud.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/agreement.html",
        destination: "/zh/agreement.html",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
// Remove the module.exports block
