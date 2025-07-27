/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-09-10 22:36:03
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-04-01 22:23:07
 * @FilePath: /lulab_website_next_js/middleware.ts
 * @Description: 参考材料https://next-intl.dev/docs/routing/middleware#example-auth-js
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */

import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth } from './auth';

// 定义公开页面
const publicPages = [
    '/',
    '/login',
    '/bootcamp',
    '/about',
    '/checkout',
    '/agreement.html',
];

// 定义允许访问子路径的页面
const pagesWithSubpaths = [
    '/bootcamp'
];

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  );

  const subpathRegex = RegExp(
    `^(/(${routing.locales.join('|')}))?(${pagesWithSubpaths
      .join('|')})/.+$`,
    'i'
  );

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);
  const isAllowedSubpath = pagesWithSubpaths.length > 0 && subpathRegex.test(req.nextUrl.pathname);

  if (isPublicPage || isAllowedSubpath) {
    return intlMiddleware(req);
  }

  if (!req.auth) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    '/',
    '/(zh|en)/:path*',
    '/((?!api|_next|_vercel|.*\..*).*)'
  ]
};