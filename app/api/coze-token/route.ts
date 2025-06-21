import { NextResponse } from 'next/server';

// 将 GET 方法更改为 POST
export async function POST() {
    const cozeToken = process.env.cozeToken;
    const cozeBotid = process.env.cozeID;

    if (!cozeToken) {
        console.error("COZE_TOKEN is not set in server environment");
        return NextResponse.json({ error: 'Coze-token not configured' });
    }
    if (!cozeBotid) {
        console.error("COZE_ID is not set in server environment"); // 修复错误信息
        return NextResponse.json({ error: 'Coze-id not configured' });
    }

    return NextResponse.json({ token: cozeToken, botId: cozeBotid }); // 返回完整数据
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
