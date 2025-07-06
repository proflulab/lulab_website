'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface CozeWebSDK {
  WebChatClient: any;
}

declare global {
  interface Window {
    CozeWebSDK: CozeWebSDK;
  }
}

const CozeChat = () => {
  const t = useTranslations('CozeChat');
  const cozeInstanceRef = useRef<any>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    const loadCozeSDK = () => {
      return new Promise((resolve, reject) => {
        if (window.CozeWebSDK) {
          resolve(window.CozeWebSDK);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.0.0-beta.4/libs/oversea/index.js';
        script.onload = () => {
          setTimeout(() => {
            resolve(window.CozeWebSDK);
          }, 100);
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initializeCoze = async () => {
      try {
        const sdk = await loadCozeSDK();
        console.log('CozeWebSDK loaded:', sdk);
        
        // 获取token
        const response = await fetch('/api/coze-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to get token');
        }
        
        const { token } = await response.json();
        
        // 定义用户信息
        const userInfo = {
          id: 'LuLab',
          url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
          nickname: 'UserA',
        };
        
        const config = {
          config: {
            bot_id: process.env.NEXT_PUBLIC_COZE_BOT_ID || '7499463698092867610',
          },
          token,
          userInfo,
          ui: {
            base: {
              icon: 'https://i.postimg.cc/Zq0mk8TH/extracted-circle.png',
              layout: isMobile ? 'mobile' : 'pc',
              zIndex: 1000,
            },
            footer: {
              isShow: false,
            },
            header: {
              icon: 'https://tse3.mm.bing.net/th/id/OIP.CNkRqfGq0B6ONJkYDbCWmwAAAA?rs=1&pid=ImgDetMain',
            },
            chatBot: {
              title: t('botchat'),
              width: '20%',
              height: '80%',
            },
            userInfo: userInfo
          }
        };

        let cozeInstance;
        
        // 尝试不同的初始化方式
        if (window.CozeWebSDK?.WebChatClient) {
          const WebChatClient = window.CozeWebSDK.WebChatClient;
          
          if (typeof WebChatClient === 'function') {
            try {
              cozeInstance = new WebChatClient(config);
              console.log('WebChatClient constructor succeeded');
            } catch (constructorError) {
              console.log('Constructor failed, trying as function:', constructorError);
              cozeInstance = WebChatClient(config);
            }
          } else if (WebChatClient.init) {
            cozeInstance = await WebChatClient.init(config);
          } else if (WebChatClient.create) {
            cozeInstance = await WebChatClient.create(config);
          } else {
            throw new Error('No suitable initialization method found for WebChatClient');
          }
        } else {
          throw new Error('WebChatClient not found in CozeWebSDK');
        }
        
        cozeInstanceRef.current = cozeInstance;
        console.log('Coze chat initialized successfully:', cozeInstance);
      } catch (error) {
        console.error('Failed to initialize Coze chat:', error);
      }
    };

    initializeCoze();

    return () => {
      if (cozeInstanceRef.current && typeof cozeInstanceRef.current.destroy === 'function') {
        cozeInstanceRef.current.destroy();
      }
    };
  }, [t, isMobile]);

  return null;
};

export default CozeChat;