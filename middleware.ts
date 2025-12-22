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

import { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// 定义公开页面
const publicPages = [
    '/',
    '/login',
    '/bootcamp',
    '/about',
    '/jobs',
    '/checkout',
    '/agreement.html',
];

// 定义允许访问子路径的页面
const pagesWithSubpaths = [
    '/bootcamp'
];

const intlMiddleware = createMiddleware(routing);

// 创建认证中间件
const authMiddleware = withAuth(
    // Note that this callback is only invoked if
    // the `authorized` callback has returned `true`
    // and not for pages listed in `pages`.
    (req) => intlMiddleware(req),
    {
        callbacks: {
            authorized: ({ token }) => token != null
        },
        pages: {
            signIn: '/login'
        }
    }
);

export default function middleware(req: NextRequest) {
    const publicPathnameRegex = RegExp(
        `^(/(${routing.locales.join('|')}))?(${publicPages
            .flatMap((p) => (p === '/' ? ['', '/'] : p))
            .join('|')})/?$`,
        'i'
    );

    // 检查是否为公开页面的子路径
    const subpathRegex = RegExp(
        `^(/(${routing.locales.join('|')}))?(${pagesWithSubpaths
            .join('|')})/.+$`,
        'i'
    );

    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);
    const isAllowedSubpath = pagesWithSubpaths.length > 0 && subpathRegex.test(req.nextUrl.pathname);

    if (isPublicPage || isAllowedSubpath) {
        return intlMiddleware(req);
    } else {
        return (authMiddleware as (req: NextRequest) => Promise<Response>)(req);
    }
}

export const config = {
    // Match only internationalized pathnames
    matcher: [
        '/',
        '/(zh|en)/:path*',
        '/((?!api|_next|_vercel|.*\\..*).*)'
    ]
};
