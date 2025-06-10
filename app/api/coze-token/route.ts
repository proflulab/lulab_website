import { NextResponse } from 'next/server';

// 将 GET 方法更改为 POST
export async function POST() {
    const cozeToken = process.env.COZE_TOKEN;

    if (!cozeToken) {
        console.error("COZE_TOKEN is not set in server environment");
        return NextResponse.json({ error: 'Coze-token not configured' });
    }

    return NextResponse.json({ token: cozeToken });
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
