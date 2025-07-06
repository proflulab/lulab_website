import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirectUri = searchParams.get('redirect_uri') || process.env.COZE_REDIRECT_URI;
  
  const authUrl = new URL('https://api.coze.cn/api/permission/oauth2/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', process.env.COZE_CLIENT_ID!);
  authUrl.searchParams.set('redirect_uri', redirectUri!);
  authUrl.searchParams.set('state', 'random_state_string');
  authUrl.searchParams.set('scope', 'chat');
  
  return NextResponse.redirect(authUrl.toString());
}