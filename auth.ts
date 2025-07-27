/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2025-03-26 13:00:16
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-03-26 15:15:05
 * @FilePath: /lulab_website_next_js/auth.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { type: 'text' },
        password: { type: 'password' }
      },
      authorize(credentials) {
        if (
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: '1', name: process.env.ADMIN_USERNAME };
        }

        return null;
      }
    })
  ]
});