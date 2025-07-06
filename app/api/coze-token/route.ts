import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // 使用一个固定的令牌或者移除令牌验证
    // 注意：这种方式安全性较低，仅适用于开发环境
    const userId = randomUUID();
    
    return NextResponse.json({ 
      token: 'demo-token', // 或者使用你的实际令牌
      userId: userId,
      userInfo: {
        id: userId,
        url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
        nickname: `User_${userId.slice(0, 8)}`
      }
    });
  } catch (error) {
    console.error('Token API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 其他 HTTP 方法的处理
export function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

export function PUT() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

export function DELETE() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}
