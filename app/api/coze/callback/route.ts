import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  
  if (!code) {
    return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
  }
  
  try {
    // 交换访问令牌
    const tokenResponse = await fetch('https://api.coze.cn/api/permission/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.COZE_CLIENT_ID,
        client_secret: process.env.COZE_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.COZE_REDIRECT_URI,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.json({ error: 'Token exchange failed' }, { status: 400 });
    }
    
    // 存储访问令牌（这里可以存储到数据库或会话中）
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('coze_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in || 3600,
    });
    
    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}