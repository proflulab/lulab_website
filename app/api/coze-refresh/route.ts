import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 刷新访问令牌的专用端点
export async function POST() {
  try {
    const refreshToken = cookies().get('coze_refresh_token')?.value;
    
    if (!refreshToken) {
      return NextResponse.json({ 
        success: false,
        error: 'No refresh token found',
        needsAuth: true 
      }, { status: 401 });
    }

    console.log('Refresh token endpoint called:', {
      hasRefreshToken: !!refreshToken,
      clientId: process.env.COZE_CLIENT_ID,
      hasClientSecret: !!(process.env.COZE_CLIENT_SECRET && process.env.COZE_CLIENT_SECRET.trim())
    });

    // 准备刷新token请求
    const tokenRequestBody = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.COZE_CLIENT_ID!,
      refresh_token: refreshToken,
    });

    // 只有在客户端密钥存在且不为空时才添加
    if (process.env.COZE_CLIENT_SECRET && process.env.COZE_CLIENT_SECRET.trim()) {
      tokenRequestBody.append('client_secret', process.env.COZE_CLIENT_SECRET);
    }

    const response = await fetch('https://api.coze.cn/api/permission/oauth2/token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: tokenRequestBody.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token refresh failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      // 如果刷新失败，清理所有相关cookies
      cookies().delete('coze_access_token');
      cookies().delete('coze_refresh_token');
      cookies().delete('coze_user_info');
      
      return NextResponse.json({ 
        success: false,
        error: 'Token refresh failed',
        details: errorText,
        needsAuth: true 
      }, { status: 401 });
    }

    const tokenData = await response.json();
    
    if (!tokenData.access_token) {
      console.error('Invalid refresh response: missing access_token', tokenData);
      
      // 清理cookies
      cookies().delete('coze_access_token');
      cookies().delete('coze_refresh_token');
      cookies().delete('coze_user_info');
      
      return NextResponse.json({ 
        success: false,
        error: 'Invalid token response',
        needsAuth: true 
      }, { status: 401 });
    }

    // 设置新的cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const
    };

    // 更新访问令牌
    cookies().set('coze_access_token', tokenData.access_token, {
      ...cookieOptions,
      maxAge: 60 * 60 // 1小时
    });
    
    // 如果有新的刷新令牌，更新它
    if (tokenData.refresh_token) {
      cookies().set('coze_refresh_token', tokenData.refresh_token, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 // 30天
      });
    }

    // 尝试获取最新的用户信息
    try {
      const userResponse = await fetch('https://api.coze.cn/oauth2/userinfo', {
        headers: { 
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json'
        },
      });
      
      if (userResponse.ok) {
        const user = await userResponse.json();
        if (user.user_id) {
          cookies().set('coze_user_info', JSON.stringify(user), {
            ...cookieOptions,
            maxAge: 24 * 60 * 60 // 24小时
          });
        }
      }
    } catch (userError) {
      console.warn('Failed to update user info during refresh:', userError);
      // 不影响token刷新的成功，只是记录警告
    }

    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      token: tokenData.access_token
    });
    
  } catch (error) {
    console.error('Token refresh endpoint error:', error);
    
    // 发生错误时清理cookies
    cookies().delete('coze_access_token');
    cookies().delete('coze_refresh_token');
    cookies().delete('coze_user_info');
    
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      needsAuth: true 
    }, { status: 500 });
  }
}

// 其他HTTP方法的处理
export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}