/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2025-03-27 10:00:00
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-03-30 01:37:53
 * @FilePath: /lulab_website_next_js/app/api/channels/[channelId]/route.ts
 * @Description: 特定渠道的API操作
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/connection';

// 删除特定渠道
export async function DELETE(request: Request, { params }: { params: { channelId: string } }) {
    try {
        const channelId = params.channelId;

        // 检查渠道是否存在
        const channel = await sql`
      SELECT id FROM channels WHERE id = ${channelId}
    `;

        if (channel.length === 0) {
            return NextResponse.json(
                { error: 'Channel not found' },
                { status: 404 }
            );
        }

        // 删除渠道
        await sql`
      DELETE FROM channels WHERE id = ${channelId}
    `;

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error deleting channel:', error);
        return NextResponse.json(
            { error: 'Failed to delete channel' },
            { status: 500 }
        );
    }
}

// 获取特定渠道的详细信息
export async function GET(request: Request, { params }: { params: { channelId: string } }) {
    try {
        const channelId = params.channelId;

        // 获取渠道信息
        const channel = await sql`
      SELECT * FROM channels WHERE id = ${channelId}
    `;

        if (channel.length === 0) {
            return NextResponse.json(
                { error: 'Channel not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ channel: channel[0] }, { status: 200 });
    } catch (error) {
        console.error('Error fetching channel:', error);
        return NextResponse.json(
            { error: 'Failed to fetch channel' },
            { status: 500 }
        );
    }
}