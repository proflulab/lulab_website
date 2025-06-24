import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Coze API 代理端点 - 保护敏感信息
export async function POST(request: NextRequest) {
    try {
        // 从服务端环境变量获取敏感信息（不暴露给客户端）
        const cozeToken = process.env.COZE_TOKEN;
        const cozeBotId = process.env.COZE_BOT_ID;
        
        if (!cozeToken || !cozeBotId) {
            console.error('Coze credentials not configured');
            return NextResponse.json(
                { error: 'Service configuration error' },
                { status: 500 }
            );
        }

        // 基本的安全验证
        const headersList = headers();
        const origin = headersList.get('origin');
        
        // 验证请求来源（可根据需要调整）
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://www.lulabs.org', // 替换为你的实际域名
        ];
        
        if (origin && !allowedOrigins.includes(origin)) {
            return NextResponse.json(
                { error: 'Unauthorized origin' },
                { status: 403 }
            );
        }

        // 解析请求体
        const body = await request.json();
        const { action, payload } = body;

        // 根据不同的action处理不同的Coze API调用
        switch (action) {
            case 'getConfig':
                // 返回安全的配置信息
                return NextResponse.json({
                    success: true,
                    config: {
                        botId: cozeBotId,
                        // 生成临时会话token或使用其他安全机制
                        sessionToken: generateSessionToken(cozeToken),
                    }
                });
                
            case 'chat':
                // 代理聊天请求到Coze API
                return await proxyChatRequest(cozeToken, cozeBotId, payload);
                
            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }
        
    } catch (error) {
        console.error('Coze proxy error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// 生成会话token（简单示例，实际应用中可使用JWT等）
function generateSessionToken(originalToken: string): string {
    // 这里可以实现更复杂的token生成逻辑
    // 例如：JWT签名、时效性控制等
    const timestamp = Date.now();
    const sessionId = Math.random().toString(36).substring(2);
    
    // 简单的编码（实际应用中应使用更安全的方法）
    return Buffer.from(`${sessionId}:${timestamp}:${originalToken}`).toString('base64');
}

// 代理聊天请求到Coze API
async function proxyChatRequest(token: string, botId: string, payload: any) {
    try {
        // 这里实现具体的Coze API调用逻辑
        // 根据Coze API文档调整请求格式
        const response = await fetch('https://api.coze.com/v1/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bot_id: botId,
                ...payload
            })
        });
        
        if (!response.ok) {
            throw new Error(`Coze API error: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json({
            success: true,
            data
        });
        
    } catch (error) {
        console.error('Coze API request failed:', error);
        return NextResponse.json(
            { error: 'Chat request failed' },
            { status: 500 }
        );
    }
}

// 其他HTTP方法的处理
export function GET() {
    return new NextResponse('Method Not Allowed', { status: 405 });
}

export function PUT() {
    return new NextResponse('Method Not Allowed', { status: 405 });
}

export function DELETE() {
    return new NextResponse('Method Not Allowed', { status: 405 });
}