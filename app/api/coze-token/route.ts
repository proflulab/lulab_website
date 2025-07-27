import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 刷新访问令牌
async function refreshAccessToken(refreshToken: string) {
  try {
    const tokenRequestBody = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.COZE_CLIENT_ID!,
      refresh_token: refreshToken,
    });

    if (process.env.COZE_CLIENT_SECRET) {
      tokenRequestBody.append('client_secret', process.env.COZE_CLIENT_SECRET);
    }

    const response = await fetch('https://api.coze.cn/api/permission/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenRequestBody.toString(),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

// 验证访问令牌是否有效
async function validateAccessToken(token: string) {
  try {
    const response = await fetch('https://api.coze.cn/oauth2/userinfo', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

export async function POST() {
  try {
    let accessToken = cookies().get('coze_access_token')?.value;
    const refreshToken = cookies().get('coze_refresh_token')?.value;
    const userInfoStr = cookies().get('coze_user_info')?.value;

    // 检查是否有基本的认证信息
    if (!accessToken && !refreshToken) {
      return NextResponse.json({ 
        needsAuth: true, 
        error: 'No authentication tokens found' 
      }, { status: 401 });
    }

    // 如果有访问令牌，验证其有效性
    if (accessToken) {
      const isValid = await validateAccessToken(accessToken);
      if (!isValid && refreshToken) {
        // 访问令牌无效，尝试刷新
        const tokenData = await refreshAccessToken(refreshToken);
        if (tokenData && tokenData.access_token) {
          accessToken = tokenData.access_token;
          
          // 更新cookies中的令牌
          cookies().set('coze_access_token', tokenData.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600 // 1小时
          });
          
          if (tokenData.refresh_token) {
            cookies().set('coze_refresh_token', tokenData.refresh_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 30 * 24 * 3600 // 30天
            });
          }
        } else {
          // 刷新失败，需要重新认证
          return NextResponse.json({ 
            needsAuth: true, 
            error: 'Token refresh failed' 
          }, { status: 401 });
        }
      } else if (!isValid) {
        // 没有刷新令牌且访问令牌无效
        return NextResponse.json({ 
          needsAuth: true, 
          error: 'Access token invalid and no refresh token available' 
        }, { status: 401 });
      }
    } else if (refreshToken) {
      // 只有刷新令牌，尝试获取新的访问令牌
      const tokenData = await refreshAccessToken(refreshToken);
      if (tokenData && tokenData.access_token) {
        accessToken = tokenData.access_token;
        
        cookies().set('coze_access_token', tokenData.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 3600
        });
        
        if (tokenData.refresh_token) {
          cookies().set('coze_refresh_token', tokenData.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 3600
          });
        }
      } else {
        return NextResponse.json({ 
          needsAuth: true, 
          error: 'Failed to obtain access token' 
        }, { status: 401 });
      }
    }

    // 解析用户信息
    let userInfo;
    if (userInfoStr) {
      try {
        userInfo = JSON.parse(userInfoStr);
      } catch (error) {
        console.error('Failed to parse user info:', error);
        return NextResponse.json({ 
          needsAuth: true, 
          error: 'Invalid user info format' 
        }, { status: 400 });
      }
    } else {
      // 如果没有用户信息，尝试获取
      try {
        const userResponse = await fetch('https://api.coze.cn/oauth2/userinfo', {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        
        if (userResponse.ok) {
          userInfo = await userResponse.json();
          cookies().set('coze_user_info', JSON.stringify(userInfo), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 3600 // 24小时
          });
        } else {
          return NextResponse.json({ 
            needsAuth: true, 
            error: 'Failed to fetch user info' 
          }, { status: 401 });
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        return NextResponse.json({ 
          needsAuth: true, 
          error: 'Error fetching user info' 
        }, { status: 500 });
      }
    }

    const userId = userInfo.user_id;
    if (!userId) {
      return NextResponse.json({ 
        needsAuth: true, 
        error: 'Invalid user data' 
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      token: accessToken,
      userId: userId,
      userInfo: {
        id: userId,
        url: userInfo.avatar_url || 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
        nickname: userInfo.user_name || `User_${userId.slice(0, 8)}`
      }
    });
  } catch (error) {
    console.error('Token endpoint error:', error);
    return NextResponse.json({ 
      needsAuth: true, 
      error: 'Internal server error' 
    }, { status: 500 });
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
