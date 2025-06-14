import { NextResponse } from 'next/server';

// 将 GET 方法更改为 POST
export async function POST() {
    const cozeToken = 'pat_a8wiVCQqT8mX67X3Z2KkOjMWYfQb7GbSllCfPqSAimROvpAYzFmCNM2IJwoc015M';
    const cozeBotId = '7499463698092867610';

    if (!cozeToken) {
        console.error("COZE_TOKEN is not set in server environment");
        return NextResponse.json({ error: 'Coze-token not configured' }, { status: 500 });
    }

    if (!cozeBotId) {
        console.error("COZE_BOT_ID is not set in server environment");
        return NextResponse.json({ error: 'Coze-bot-id not configured' }, { status: 500 });
    }

    return NextResponse.json({ 
        token: cozeToken,
        botId: cozeBotId
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
