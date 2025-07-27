'use client';

import { useRef, useCallback, useState } from 'react';
import "@coze/chat-sdk/webCss";
import ChatSdk from "@coze/chat-sdk/webJs";
const { ChatFramework, ChatSlot, ChatType, Language } = ChatSdk;

type UserInfo = {
  id: string;
  url: string;
  nickname: string;
};

type CozeChatClientProps = {
  token: string;
  userInfo: UserInfo;
  isMobile: boolean;
  t: (key: string) => string;
};

export default function CozeChatClient({ token, userInfo, isMobile, t }: CozeChatClientProps) {
  const cozeChatContainerRef = useRef<HTMLDivElement>(null);
  const [currentToken, setCurrentToken] = useState(token);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Token刷新函数
  const refreshToken = useCallback(async (): Promise<string> => {
    if (isRefreshing) {
      // 如果正在刷新，等待当前刷新完成
      return new Promise((resolve) => {
        const checkRefresh = () => {
          if (!isRefreshing) {
            resolve(currentToken);
          } else {
            setTimeout(checkRefresh, 100);
          }
        };
        checkRefresh();
      });
    }

    setIsRefreshing(true);
    
    try {
      console.log('Refreshing token for chat...');
      const response = await fetch('/api/coze-refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.token) {
        console.log('Token refreshed successfully for chat');
        setCurrentToken(data.token);
        return data.token;
      } else {
        throw new Error(data.error || 'Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error in chat:', error);
      // 如果刷新失败，重定向到认证页面
      window.location.href = '/api/coze-auth?action=start';
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [currentToken, isRefreshing]);

  return (
    <div
      ref={cozeChatContainerRef}
      id="coze-chat-container"
      style={{
        display: 'block',
        width: isMobile ? 'calc(100vw - 20px)' : '460px',
        height: isMobile ? '70vh' : '80%',
        maxWidth: isMobile ? '400px' : undefined,
        position: 'fixed' as const,
        bottom: '20px',
        right: isMobile ? '10px' : '20px',
        zIndex: 1000,
        borderRadius: isMobile ? '12px' : undefined,
        boxShadow: isMobile ? '0 4px 20px rgba(0, 0, 0, 0.15)' : undefined,
      }}
    >
      <ChatFramework
        chat={{ appId: process.env.NEXT_PUBLIC_COZE_BOT_ID || '', type: ChatType.Bot }}
        setting={{ 
          apiBaseUrl: 'https://api.coze.cn', 
          language: Language.EN, 
          requestHeader: {}, 
          logLevel: 'debug', 
          cdnBaseUrlPath: 'https://cdn.coze.cn' 
        }}
        auth={{ 
          token: currentToken, 
          onRefreshToken: refreshToken 
        }}
        user={{
          id: userInfo.id,
          name: userInfo.nickname,
          avatar: userInfo.url
        }}
        ui={{
          layout: isMobile ? 'mobile' : 'pc',
          footer: { isNeed: false },
          header: { 
            icon: 'https://tse3.mm.bing.net/th/id/OIP.CNkRqfGq0B6ONJkYDbCWmwAAAA?rs=1&pid=ImgDetMain', 
            title: t('botchat') 
          } 
        }}
      >
        <ChatSlot />
      </ChatFramework>
    </div>
  );
}
