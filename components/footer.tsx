/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-11-28 15:45:22
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-03-25 18:57:07
 * @FilePath: /lulab_website_next_js/components/footer.tsx
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */

import { Link } from '@/i18n/routing';
import { Mail, MapPin } from "lucide-react";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger, } from "@/components/ui/hover-card";

// 抽取导航链接配置
const QUICK_LINKS = [
    { href: '/about', key: 'about' },
    { href: '/bootcamp', key: 'bootcamp' },
    // { href: '/join', key: 'joinUs' },
] as const;

// 抽取联系方式配置
const CONTACT_INFO = [
    { icon: Mail, key: 'email' },
    { icon: MapPin, key: 'address' },
] as const;

// 抽取 Footer Column 组件
function FooterColumn({
    title,
    children
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <h3 className="font-bold text-lg mb-4">{title}</h3>
            {children}
        </div>
    );
}

export function Footer() {
    const t = useTranslations('Footer');
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-secondary py-12">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Title Section */}
                    <FooterColumn title={t('title.name')}>
                        <p className="text-muted-foreground">
                            {t('title.slogan')}
                        </p>
                    </FooterColumn>

                    {/* Quick Links Section */}
                    <FooterColumn title={t('quickLinks.title')}>
                        <ul className="space-y-2">
                            {QUICK_LINKS.map(({ href, key }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                                    >
                                        {t(`quickLinks.items.${key}`)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </FooterColumn>

                    {/* Contact Section */}
                    <FooterColumn title={t('contact.title')}>
                        <ul className="space-y-2">
                            {CONTACT_INFO.map(({ icon: Icon, key }) => (
                                <li
                                    key={key}
                                    className="flex items-center gap-2 text-muted-foreground"
                                >
                                    <Icon className="h-4 w-4 flex-shrink-0" />
                                    {t(`contact.items.${key}`)}
                                </li>
                            ))}
                        </ul>
                    </FooterColumn>

                    {/* Follow Us Section */}
                    <FooterColumn title={t('followUs.title')}>
                        {/* <p className="text-muted-foreground">
                            {t('followUs.items.wechat')}
                        </p> */}
                        <p className="text-muted-foreground">
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    {/* <Button variant="link">{t('followUs.items.wechat')}</Button> */}
                                    {/* {t('followUs.items.wechat')} */}
                                    <span className="cursor-pointer">
                                        {t('followUs.items.wechat')}
                                    </span>
                                </HoverCardTrigger>
                                <HoverCardContent className="p-0 w-auto h-auto">
                                    <div className="flex justify-center items-center">
                                        <Image
                                            src="/images/about/wechat-qr.jpg"
                                            alt="WeChat QR Code"
                                            width={200}
                                            height={200}
                                            className="rounded-lg"
                                        />
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        </p>
                    </FooterColumn>
                </div>

                <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
                    <p>{t('copyright', { year: currentYear })}</p>
                </div>
            </div>
        </footer>
    );
}