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
  const cozeChatContainerRef = useRef<HTMLDivElement>(null);
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
        console.log('Available methods:', Object.keys(sdk as object));
        
        // 详细探索 WebChatClient 的结构
        if ((sdk as any).WebChatClient) {
          const webChatClient = (sdk as any).WebChatClient;
          console.log('WebChatClient found:', webChatClient);
          console.log('WebChatClient type:', typeof webChatClient);
          console.log('WebChatClient methods:', Object.keys(webChatClient as object));
          
          // 如果是构造函数，尝试实例化
          if (typeof webChatClient === 'function') {
            console.log('WebChatClient is a constructor function');
            console.log('WebChatClient prototype methods:', Object.getOwnPropertyNames(webChatClient.prototype));
          }
        }
        
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
          componentProps: {
            title: t('botchat'),
            style: {
              width: isMobile ? '100%' : '400px',
              height: isMobile ? '100%' : '600px',
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 9999,
            },
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
              isShow: false
            },
            header: {
              icon: 'https://tse3.mm.bing.net/th/id/OIP.CNkRqfGq0B6ONJkYDbCWmwAAAA?rs=1&pid=ImgDetMain',
            },
            chatBot: {
              title: t('AI'),
               el: undefined,
               width: 400,
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
            // 尝试作为构造函数使用
            console.log('Trying WebChatClient as constructor');
            try {
              cozeInstance = new WebChatClient(config);
              console.log('WebChatClient constructor succeeded');
            } catch (constructorError) {
              console.log('Constructor failed:', constructorError);
              
              // 尝试直接调用
              console.log('Trying WebChatClient as function');
              cozeInstance = WebChatClient(config);
            }
          } else if (WebChatClient.init) {
            console.log('Using WebChatClient.init');
            cozeInstance = await WebChatClient.init(config);
          } else if (WebChatClient.create) {
            console.log('Using WebChatClient.create');
            cozeInstance = await WebChatClient.create(config);
          } else {
            console.log('Available WebChatClient methods:', Object.keys(WebChatClient));
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

    // 清理函数
    return () => {
      if (cozeInstanceRef.current && typeof cozeInstanceRef.current.destroy === 'function') {
        cozeInstanceRef.current.destroy();
      }
    };
  }, [t, isMobile]);

  return null;
};

export default CozeChat;