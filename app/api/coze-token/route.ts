import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// 将 GET 方法更改为 POST
export async function POST() {
    const cozeToken = process.env.COZE_TOKEN;

    if (!cozeToken) {
        console.error("COZE_TOKEN is not set in server environment");
        return NextResponse.json({ error: 'Coze-token not configured' });
    }

    // 生成唯一的用户ID
    const userId = uuidv4();
    
    return NextResponse.json({ 
        token: cozeToken,
        userId: userId,
        userInfo: {
            id: userId,
            url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
            nickname: `User_${userId.slice(0, 8)}`
        }
    });
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
