/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2025-01-06 00:28:21
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-04-01 22:52:38
 * @FilePath: /lulab_website_next_js/app/[locale]/(main)/bootcamp/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "@/components/bootcamp/ProjectCard";
import { ChevronRight, } from "lucide-react";
import React, { useEffect, useState } from 'react';
import Cube from '@/components/bootcamp/Cube';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { LoadingSpinner } from "@/components/LoadingSpinner";


interface Project {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    image: string;
    duration: string;
    level: string;
    maxStudents: number;
    description: string;
    slug: string;
}


export default function BootcampPage() {
    const t = useTranslations('BootcampPage');
    const searchParams = useSearchParams();
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const projectsSectionRef = React.useRef<HTMLDivElement>(null);
    const [showFixedNav, setShowFixedNav] = useState(false);
    const [channelCode, setChannelCode] = useState<string>(''); // 默认渠道代码为空

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setShowFixedNav(scrollPosition > 400); // 当滚动超过400px时显示
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 单独处理渠道代码的 useEffect
    useEffect(() => {
        // 检查URL中是否有渠道参数
        const channelParam = searchParams?.get('channel');
        if (channelParam) {
            setChannelCode(channelParam);
        }
    }, [searchParams]);

    const scrollToProjects = () => {
        projectsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await fetch('/api/projects', { cache: 'no-store' });
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Hero Section */}
            <section className="h-screen relative" >
                <div className="container mx-auto px-4 relative h-full flex ">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.8,
                                    ease: "easeOut"
                                }
                            }
                        }}
                        className="max-w-4xl pt-20"
                    >
                        <motion.h1
                            className="text-4xl md:text-7xl font-extrabold mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#ff9300] to-[#ff0099] leading-tight"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <span className="mr-8 md:mr-8 block md:inline">
                                {t("Hero.title")}
                            </span>
                            <br />
                            <span className="ml-0 md:ml-24 block md:inline">
                                {t("Hero.subtitle")}
                            </span>
                        </motion.h1>
                        <motion.p
                            className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            {t("Hero.description")}
                        </motion.p>
                        <motion.div
                            className="flex items-center gap-4 flex-wrap"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            <a
                                href={channelCode ? `/checkout?channel=${channelCode}` : `/checkout`}
                                className="group inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-[#ff9300] to-[#ff0099] text-white hover:from-[#ff8c00] hover:to-[#ff00b5] transition-all shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-lg relative z-10"
                            >
                                {t("Hero.enrollButton")}
                                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </a>
                            <button
                                onClick={scrollToProjects}
                                className="group inline-flex items-center px-6 py-3 rounded-full border-2 border-primary/20 bg-background/50 hover:bg-primary/10 hover:border-primary transition-all relative z-10 font-medium"
                            >
                                {t("Hero.projectsButton")}
                                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </button>
                            <a
                                href="https://oad0a72p9r.feishu.cn/wiki/UU1WwuiFMiBwRtkR9k8c6oVWngf"
                                className="group inline-flex items-center px-6 py-3 rounded-full border-2 border-primary/20 bg-background/50 hover:bg-primary/10 hover:border-primary transition-all relative z-10 font-medium"
                            >
                                {t("Hero.learnMoreButton")}
                                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
                {/* Background Cube Section */}
                <div className="hidden md:block absolute inset-0 opacity-80 ">
                    <Cube />
                </div>
            </section>

            {/* Projects Section */}
            <section ref={projectsSectionRef} className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                    >
                        <h2 className="text-3xl font-bold mb-12 text-center">{t("Projects.title")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {loading ? (
                                <div className="col-span-full flex justify-center p-8">
                                    <LoadingSpinner />
                                </div>
                            ) : (
                                projects.map((project) => (
                                    <ProjectCard key={project.id} {...project} slug={project.slug} />
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Fixed Bottom Navigation Bar */}
            <motion.div
                className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t z-50 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]"
                initial={{ y: 100 }}
                animate={{ y: showFixedNav ? 0 : 100 }}
                transition={{ duration: 0.3 }}
            >
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">{t("CTA.question")}</span>
                    </div>
                    <a
                        href={channelCode ? `/checkout?channel=${channelCode}` : `/checkout`}
                        className="group inline-flex items-center px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium shadow-lg hover:shadow-xl hover:scale-105 sm:px-4 sm:py-2"
                    >
                        {t("CTA.enrollButton")}
                        <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </a>
                </div>
            </motion.div>
        </div>
    );
}