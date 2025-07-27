import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes, createHash } from 'crypto';

function generateCodeVerifier() {
  return randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier: string) {
  return createHash('sha256').update(verifier).digest('base64url');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const code = searchParams.get('code');

  if (action === 'start') {
    const state = randomBytes(16).toString('base64url');
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    const authUrl = `https://api.coze.cn/api/permission/oauth2/authorize?` +
      `client_id=${encodeURIComponent(process.env.COZE_CLIENT_ID!)}&` +
      `redirect_uri=${encodeURIComponent(process.env.COZE_REDIRECT_URI!)}&` +
      `response_type=code&` +
      `state=${encodeURIComponent(state)}&` +
      `code_challenge=${encodeURIComponent(codeChallenge)}&` +
      `code_challenge_method=S256`;

    cookies().set('coze_code_verifier', codeVerifier, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    cookies().set('coze_state', state, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return NextResponse.redirect(authUrl);
  } else if (code) {
    // Callback - only process if we have a code parameter
    const state = searchParams.get('state');
    const storedState = cookies().get('coze_state')?.value;

    if (!code || state !== storedState) {
      return NextResponse.json({ error: 'Invalid state or code' }, { status: 400 });
    }

    const verifier = cookies().get('coze_code_verifier')?.value;
    if (!verifier) {
      return NextResponse.json({ error: 'Missing code verifier' }, { status: 400 });
    }

    try {
      // 准备token请求参数
      const tokenRequestBody = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.COZE_CLIENT_ID!,
        redirect_uri: process.env.COZE_REDIRECT_URI!,
        code: code,
        code_verifier: verifier,
      });

      // 如果有客户端密钥，添加到请求中
      if (process.env.COZE_CLIENT_SECRET) {
        tokenRequestBody.append('client_secret', process.env.COZE_CLIENT_SECRET);
      }

      // 发送token交换请求
      const tokenResponse = await fetch('https://api.coze.cn/api/permission/oauth2/token', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: tokenRequestBody.toString(),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token exchange failed:', {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          error: errorText,
          requestData: {
            grant_type: 'authorization_code',
            client_id: process.env.COZE_CLIENT_ID,
            redirect_uri: process.env.COZE_REDIRECT_URI,
            code: code.substring(0, 10) + '...', // 只显示部分code用于调试
          }
        });
        
        // 清理临时cookies
        cookies().delete('coze_code_verifier');
        cookies().delete('coze_state');
        
        return NextResponse.redirect(`/?error=token_exchange_failed&details=${encodeURIComponent(errorText)}`);
      }

      const tokenData = await tokenResponse.json();
      
      // 验证token响应数据
      if (!tokenData.access_token) {
        console.error('Invalid token response: missing access_token', tokenData);
        cookies().delete('coze_code_verifier');
        cookies().delete('coze_state');
        return NextResponse.redirect('/?error=invalid_token_response');
      }

      // 获取用户信息
      const userResponse = await fetch('https://api.coze.cn/oauth2/userinfo', {
        headers: { 
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json'
        },
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error('User info request failed:', {
          status: userResponse.status,
          statusText: userResponse.statusText,
          error: errorText
        });
        
        // 清理临时cookies
        cookies().delete('coze_code_verifier');
        cookies().delete('coze_state');
        
        return NextResponse.redirect(`/?error=user_info_failed&details=${encodeURIComponent(errorText)}`);
      }

      const user = await userResponse.json();
      
      // 验证用户数据
      if (!user.user_id) {
        console.error('Invalid user response: missing user_id', user);
        cookies().delete('coze_code_verifier');
        cookies().delete('coze_state');
        return NextResponse.redirect('/?error=invalid_user_data');
      }

      // 设置cookies，包含过期时间
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const
      };

      // 设置用户信息cookie（24小时过期）
      cookies().set('coze_user_info', JSON.stringify(user), {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 // 24小时
      });
      
      // 设置访问令牌cookie（1小时过期）
      cookies().set('coze_access_token', tokenData.access_token, {
        ...cookieOptions,
        maxAge: 60 * 60 // 1小时
      });
      
      // 设置刷新令牌cookie（30天过期）
      if (tokenData.refresh_token) {
        cookies().set('coze_refresh_token', tokenData.refresh_token, {
          ...cookieOptions,
          maxAge: 30 * 24 * 60 * 60 // 30天
        });
      }

      // 清理临时cookies
      cookies().delete('coze_code_verifier');
      cookies().delete('coze_state');

      // 重定向到首页，带上成功标识
      return NextResponse.redirect('/?auth=success');
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      
      // 清理临时cookies
      cookies().delete('coze_code_verifier');
      cookies().delete('coze_state');
      
      return NextResponse.redirect('/?error=oauth_callback_failed');
    }
  } else {
    // Invalid request - neither start action nor callback code
    return NextResponse.json({ error: 'Invalid request. Use ?action=start to initiate OAuth or provide code parameter for callback.' }, { status: 400 });
  }
}