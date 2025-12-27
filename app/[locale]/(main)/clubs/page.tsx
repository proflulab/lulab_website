/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-09-09 15:21:05
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-01-05 20:17:54
 * @FilePath: /lulab_website_next_js/app/clubs/page.tsx
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */

import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

const clubsCopy = {
    zh: {
        title: '俱乐部',
        description: '探索陆向谦实验室的元宇宙与人工智能俱乐部，体验游戏化学习与团队项目实践。',
    },
    en: {
        title: 'Clubs',
        description: 'Discover Lu Lab clubs for metaverse and AI, combining gamified learning with collaborative projects.',
    },
};

export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const copy = clubsCopy[locale as 'zh' | 'en'] ?? clubsCopy.zh;

    return buildPageMetadata({
        locale,
        path: '/clubs',
        title: copy.title,
        description: copy.description,
    });
}

interface Club {
    id: number;
    name: string;
    description: string;
}

const clubs: Club[] = [
    { id: 1, name: '元宇宙俱乐部', description: '通过游戏化培养孩子逻辑思维、英文及编程技能' },
    { id: 2, name: '人工智能俱乐部', description: '用硅谷技术做工业级项目，培养团队协作及领导力' },
];

const ClubList: React.FC = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {clubs.map((club) => (
                    <div key={club.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                        <h2>{club.name}</h2>
                        <p>{club.description}</p>
                        {/* <Link href={`/clubs/${club.id}`}>
                            <a style={{ color: '#0070f3', textDecoration: 'none' }}>查看详情</a>
                        </Link> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClubList;
