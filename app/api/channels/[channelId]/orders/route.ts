/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2025-03-27 10:00:00
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-03-30 01:40:48
 * @FilePath: /lulab_website_next_js/app/api/channels/[channelId]/orders/route.ts
 * @Description: 获取特定渠道的订单信息
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/connection';

// 获取特定渠道的订单列表
export async function GET(request: Request, { params }: { params: { channelId: string } }) {
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

        // 获取该渠道的所有订单
        const orders = await sql`
      SELECT * FROM orders 
      WHERE channel_id = ${channelId}
      ORDER BY created_at DESC
    `;

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        console.error('Error fetching channel orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch channel orders' },
            { status: 500 }
        );
    }
}