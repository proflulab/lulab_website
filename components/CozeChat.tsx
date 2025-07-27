'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const CozeChatClient = dynamic(() => import('./CozeChatClient'), { ssr: false });

export default function CozeChat() {
  const t = useTranslations('CozeChat');
  const [isMobile, setIsMobile] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticating) return; // 防止重复授权
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/coze-token', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.needsAuth) {
          console.log('Authentication required, redirecting to OAuth...');
          setIsAuthenticating(true);
          window.location.href = '/api/coze-auth?action=start';
          return;
        }
        
        if (data.success && data.token && data.userInfo) {
          setToken(data.token);
          setUserInfo(data.userInfo);
        } else {
          console.error('Invalid response data:', data);
          // 尝试刷新token
          await tryRefreshToken();
        }
      } catch (error) {
        console.error('Failed to fetch Coze token and user info:', error);
        // 尝试刷新token
        await tryRefreshToken();
      } finally {
        setIsLoading(false);
      }
    };
    
    const tryRefreshToken = async () => {
      try {
        console.log('Attempting to refresh token...');
        const refreshResponse = await fetch('/api/coze-refresh', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success) {
            console.log('Token refreshed successfully, retrying...');
            // 重新尝试获取token和用户信息
            setTimeout(() => {
              fetchData();
            }, 1000);
            return;
          }
        }
        
        // 刷新失败，需要重新认证
        console.log('Token refresh failed, redirecting to OAuth...');
        setIsAuthenticating(true);
        window.location.href = '/api/coze-auth?action=start';
      } catch (refreshError) {
        console.error('Token refresh error:', refreshError);
        setIsAuthenticating(true);
        window.location.href = '/api/coze-auth?action=start';
      }
    };
    
    fetchData();
  }, [isAuthenticating]);

  if (isLoading || isAuthenticating) {
    return null; // 或者显示加载指示器
  }

  return (
    <>
      {token && userInfo && (
        <CozeChatClient
          token={token}
          userInfo={userInfo}
          isMobile={isMobile}
          t={t}
        />
      )}
    </>
  );
}