import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 用户登出端点
export async function POST() {
  try {
    // 清理所有Coze相关的cookies
    cookies().delete('coze_access_token');
    cookies().delete('coze_refresh_token');
    cookies().delete('coze_user_info');
    cookies().delete('coze_code_verifier');
    cookies().delete('coze_state');

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // 即使发生错误，也要尝试清理cookies
    try {
      cookies().delete('coze_access_token');
      cookies().delete('coze_refresh_token');
      cookies().delete('coze_user_info');
      cookies().delete('coze_code_verifier');
      cookies().delete('coze_state');
    } catch (cleanupError) {
      console.error('Cookie cleanup error:', cleanupError);
    }
    
    return NextResponse.json({ 
      success: false,
      error: 'Logout failed',
      message: 'An error occurred during logout, but cookies have been cleared'
    }, { status: 500 });
  }
}

// GET方法用于简单的登出（通过URL访问）
export async function GET() {
  try {
    // 清理所有Coze相关的cookies
    cookies().delete('coze_access_token');
    cookies().delete('coze_refresh_token');
    cookies().delete('coze_user_info');
    cookies().delete('coze_code_verifier');
    cookies().delete('coze_state');

    // 重定向到首页
    return NextResponse.redirect(new URL('/?logout=success', process.env.NEXTAUTH_URL || 'http://localhost:3000'));
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // 即使发生错误，也要尝试清理cookies并重定向
    try {
      cookies().delete('coze_access_token');
      cookies().delete('coze_refresh_token');
      cookies().delete('coze_user_info');
      cookies().delete('coze_code_verifier');
      cookies().delete('coze_state');
    } catch (cleanupError) {
      console.error('Cookie cleanup error:', cleanupError);
    }
    
    return NextResponse.redirect(new URL('/?logout=error', process.env.NEXTAUTH_URL || 'http://localhost:3000'));
  }
}

// 其他HTTP方法的处理
export function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}