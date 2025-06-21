import {NextResponse} from 'next/server';
// 将 GET 方法更改为 POST
export async function POST () {
    const cozeToken = process.env.cozetoken;
    const cozeBotid = process.env.cozeID;
    if (!cozeToken) {
        console.error ("COZE_TOKEN is not set in server environment")
        return NextResponse.json ({error: 'Coze-token not configured' }, { status: 500 });
    }
    if (!cozeBotid) {
        console.error ("COZE_BOT_ID is not set in server environment");
        return NextResponse.json ({ error: 'Coze-bot-id not.con"figured'}, { status: 500 });
    }
    return NextResponse.json ({
        token: cozeToken,
        botid: cozeBotid
    });
}
//. 其他 HTTP 方法的处理
export function GET() {
    return new NextResponse ('Method Not Allowed', { status:405 });
}
export function PUT() {
    return new NextResponse ('Method Not Allowed', { status:405 });
}
export function DELETE() {
    return new NextResponse ('Method Not Allowed', { status:405});
}