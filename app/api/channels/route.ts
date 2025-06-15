/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2025-03-27 10:00:00
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-03-30 01:37:16
 * @FilePath: /lulab_website_next_js/app/api/channels/route.ts
 * @Description: 渠道管理API
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/connection';

// 获取所有渠道
export async function GET() {
  try {
    // 获取渠道列表，并包含每个渠道的订单数和总金额
    const result = await sql`
      SELECT 
        c.*, 
        COUNT(o.id) AS order_count, 
        COALESCE(SUM(o.amount), 0) AS total_amount
      FROM 
        channels c
      LEFT JOIN 
        orders o ON c.id = o.channel_id
      GROUP BY 
        c.id
      ORDER BY 
        c.created_at DESC
    `;

    return NextResponse.json({ channels: result }, { status: 200 });
  } catch (error) {
    console.error('Error fetching channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    );
  }
}

// 创建新渠道
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, code, description } = body;

    // 验证必填字段
    if (!name || !code) {
      return NextResponse.json(
        { error: 'Name and code are required' },
        { status: 400 }
      );
    }

    // 检查渠道代码是否已存在
    const existingChannel = await sql`
      SELECT id FROM channels WHERE code = ${code}
    `;

    if (existingChannel.length > 0) {
      return NextResponse.json(
        { error: 'Channel code already exists' },
        { status: 409 }
      );
    }

    // 创建新渠道
    const result = await sql`
      INSERT INTO channels (name, code, description)
      VALUES (${name}, ${code}, ${description})
      RETURNING *
    `;

    return NextResponse.json({ channel: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating channel:', error);
    return NextResponse.json(
      { error: 'Failed to create channel' },
      { status: 500 }
    );
  }
}