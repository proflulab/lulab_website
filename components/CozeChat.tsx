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

import { useEffect, useRef } from 'react';
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
                    userInfo: {
                        id: '12345';
                        url: string;
                        nickname: string;
                    };
                };
            }) => void;
        };
    }
}

export default function CozeChat() {
    const t = useTranslations('CozeChat');
    const cozeChatContainerRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<any>(null);

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
        let isMounted = true;
        
        const initCozeChat = async () => {
            if (!cozeChatContainerRef.current || !window.CozeWebSDK) {
                return;
            }

            // 清理之前的实例
            cleanupCoze();
            
            // 获取token
            let token = null;
            try {
                const response = await fetch('/api/coze-token', { method: 'POST' });
                if (response.ok) {
                    const data = await response.json();
                    token = data.token;
                }
            } catch (error) {
                console.error('Failed to fetch Coze token:', error);
                return;
            }

            if (!token || !isMounted) {
                return;
            }

            const config = {
                config: {
                    bot_id: '7499463698092867610',
                },
                componentProps: {
                    title: t('botchat')
                },
                auth: {
                    type: 'token',
                    token: token,
                    onRefreshToken: () => token
                },
                ui: {
                    base: {
                        icon: 'https://img-bsy.txrpic.com/preview/Element/00/00/89/11/E-891182-2418FE26A.png?imageMogr2/quality/90/thumbnail/320x%3E',
                        layout: 'pc',
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
                instanceRef.current = new window.CozeWebSDK.WebChatClient({
                    ...config,
                    ui: {
                        ...config.ui,
                        userInfo: {
                            ...config.ui.userInfo,
                            id: '12345' as const // 将 id 类型固定为字面量类型 "12345"
                        }
                    }
                });
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
    }, [t]); // 依赖翻译函数，语言变化时重新初始化

    return (
        <div
            ref={cozeChatContainerRef}
            id="coze-chat-container"
            style={{
                display: 'none',
                width: '460px',
                height: '80%',
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 1000,
            }}
        />
    );
}