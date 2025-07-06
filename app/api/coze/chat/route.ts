import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { message, conversation_id } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    // 从cookie获取访问令牌
    const accessToken = request.cookies.get('coze_access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const chatResponse = await fetch('https://api.coze.cn/open_api/v2/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation_id: conversation_id || uuidv4(),
        bot_id: process.env.COZE_BOT_ID,
        user: uuidv4(),
        query: message,
        chat_history: [],
        stream: false,
      }),
    });
    
    const chatData = await chatResponse.json();
    
    if (!chatResponse.ok) {
      console.error('Chat API error:', chatData);
      return NextResponse.json({ error: 'Chat request failed' }, { status: 400 });
    }
    
    return NextResponse.json(chatData);
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}