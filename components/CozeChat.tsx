/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2025-05-03 10:18:36
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-05-04 12:10:38
 * @FilePath: /lulab_website_next_js/components/CozeChat.tsx
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

declare global {
    interface Window {
        CozeWebSDK: {
            WebChatClient: new (config: {
                config: {
                    bot_id: string;
                };
                componentProps: {
                    title: string;
                };
                auth: {
                    type: string;
                    token: string;
                    onRefreshToken: () => string;
                userInfo: {
                    id: string;
                    url: string;
                    nickname: string;
                    };
                };
                ui: {
                    base: {
                        icon: string;
                        layout: string;
                        zIndex: number;
                    };
                    footer: {
                        isShow: boolean;
                    };
                    header: {
                        icon: string;
                    };
                    chatBot: {
                        title: string;
                        el?: HTMLElement;
                    };
                };
            }) => CozeWebChatInstance;
        };
    }
}

// 添加 CozeWebChatInstance 接口定义
interface CozeWebChatInstance {
    destroy?: () => void;
    // 可以根据需要添加其他方法
}

export default function CozeChat() {
    const t = useTranslations('CozeChat');
    const cozeChatContainerRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<CozeWebChatInstance | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const cleanupCoze = () => {
        // 清理现有实例
        if (instanceRef.current) {
            if (typeof instanceRef.current.destroy === 'function') {
                instanceRef.current.destroy();
            }
            instanceRef.current = null;
        }
        
        // 清理DOM元素
        const selectors = [
            '[id*="coze"]:not(#coze-chat-container)',
            '[class*="coze"]',
            '[class*="chat-widget"]',
            'iframe[src*="coze"]'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
            });
        });
    };

    useEffect(() => {
        // 检测屏幕尺寸
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        // 初始检测
        checkScreenSize();
        
        // 添加窗口大小变化监听器
        window.addEventListener('resize', checkScreenSize);
        
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        
        const initCozeChat = async () => {
            if (!cozeChatContainerRef.current || !window.CozeWebSDK) {
                return;
            }

            // 清理之前的实例
            cleanupCoze();
            
            // 获取token和botId
            let token = null;
            let botId = null;
            try {
                const response = await fetch('/api/coze-token', { method: 'POST' });
                if (response.ok) {
                    const data = await response.json();
                    token = data.token;
                    botId = data.botId;
                }
            } catch (error) {
                console.error('Failed to fetch Coze token and botId:', error);
                return;
            }

            if (!token || !botId || !isMounted) {
                return;
            }

            const config = {
                config: {
                    bot_id: botId,
                },
                componentProps: {
                    title: t('botchat')
                },
                auth: {
                    type: 'token',
                    token: token,
                    onRefreshToken: () => token,
                    userInfo: {
                        id: '12345',
                        url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
                        nickname: 'User',
                    }
                },
                ui: {
                    base: {
                        icon: 'https://i.postimg.cc/909T36tF/Chat-GPT-Image-2025-6-14-09-45-06.png',
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
                        title: t('botchat'),
                        el: cozeChatContainerRef.current
                    },
                    userInfo: {
                        id: '12345',
                        url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
                        nickname: 'UserA',
                    }
                }
            };

            try {
                instanceRef.current = new window.CozeWebSDK.WebChatClient(config);
                if (isMounted && cozeChatContainerRef.current) {
                    cozeChatContainerRef.current.style.display = 'block';
                }
            } catch (error) {
                console.error('Failed to initialize CozeWebSDK:', error);
            }
        };

        const loadSDKAndInit = () => {
            const sdkScriptId = 'coze-web-sdk-script';
            if (!document.getElementById(sdkScriptId)) {
                const script = document.createElement('script');
                script.src = 'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/cn/index.js';
                script.async = true;
                script.id = sdkScriptId;
                script.onload = initCozeChat;
                script.onerror = () => {
                    console.error('Failed to load Coze Web SDK script.');
                };
                document.body.appendChild(script);
            } else if (window.CozeWebSDK) {
                initCozeChat();
            }
        };

        loadSDKAndInit();

        return () => {
            isMounted = false;
            cleanupCoze();
        };
    }, [t, isMobile]); // 依赖翻译函数和屏幕尺寸，变化时重新初始化

    // 获取响应式样式
    const getResponsiveStyles = () => {
        if (isMobile) {
            return {
                display: 'none',
                width: 'calc(100vw - 20px)',
                height: '70vh',
                maxWidth: '400px',
                position: 'fixed' as const,
                bottom: '20px',
                right: '10px',
                zIndex: 1000,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            };
        } else {
            return {
                display: 'none',
                width: '460px',
                height: '80%',
                position: 'fixed' as const,
                bottom: '20px',
                right: '20px',
                zIndex: 1000,
            };
        }
    };

    return (
        <div
            ref={cozeChatContainerRef}
            id="coze-chat-container"
            style={getResponsiveStyles()}
        />
    );
};

export default CozeChat;