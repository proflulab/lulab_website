'use client';

import { useParams, notFound } from "next/navigation";
import { useRouter } from '@/i18n/routing';
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CurriculumSection } from "@/components/bootcamp/CurriculumSection";
import { CourseFeatures } from "@/components/bootcamp/CourseFeatures";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useEffect, useState, Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';


// 单个课程内容的接口
interface CurriculumItem {
    title: string;                // 课程标题
    topics: string[];             // 课程包含的主题
    goals: string | null;         // 学习目标，可为空
    description: string;          // 课程描述
    week: number;                 // 所属周次
}


// API 返回数据的接口
interface ProjectDetail {
    id: string;                   // 项目 ID
    title: string;                // 项目标题
    image: string;
    slug: string;                 // 项目标识符
    subtitle: string;             // 项目副标题
    description: string;          // 项目描述
    category: string;             // 项目类别
    duration: string;             // 项目时长
    level: string;                // 项目难度级别
    max_students: number;         // 最大学生人数
    prerequisites: string[];      // 先修条件
    outcomes: string[];           // 学习成果
    curriculum: CurriculumItem[]; // 课程内容数组
}

export default function ProjectDetails() {
    const params = useParams();
    const router = useRouter();
    const t = useTranslations('BootcampPage');
    const searchParams = useSearchParams();

    // const project = getProjectById(bootcampId);

    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [channelCode, setChannelCode] = useState<string>(''); // 默认渠道代码为空
    
    const bootcampId = params?.bootcampId as string;

    useEffect(() => {
        // 如果没有bootcampId参数，直接返回
        if (!bootcampId) {
            return;
        }
        async function fetchProject() {
            try {
                setLoading(true);
                const response = await fetch(`/api/bootcamp/${bootcampId}`, { cache: 'no-store' });
                if (!response.ok) {
                    setError(true);
                    return;
                }
                const data = await response.json();
                setProject(data.project);
            } catch (error) {
                setError(true);
                console.error('Error fetching project:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProject();
    }, [bootcampId]);

    // 单独处理渠道代码的 useEffect
    useEffect(() => {
        // 检查URL中是否有渠道参数
        const channelParam = searchParams?.get('channel');
        if (channelParam) {
            setChannelCode(channelParam);
        }
    }, [searchParams]);

    // 如果没有bootcampId参数，返回404
    if (!bootcampId) {
        return notFound();
    }

    if (loading) {
        return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
    }

    if (error || !project) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="relative h-[50vh] w-full overflow-hidden group">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover brightness-[0.4] transform scale-105 group-hover:scale-110 transition-all duration-700 ease-out"
                    priority
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 bg-gradient-to-b from-black/30 via-black/50 to-black/70">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center shadow-text bg-clip-text">
                            {project.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-center max-w-3xl px-4 leading-relaxed shadow-text text-gray-200">
                            {project.subtitle}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-16"
                >
                    <CourseFeatures
                        duration={project.duration}
                        level={project.level}
                        maxStudents={project.max_students}
                    />
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="prose dark:prose-invert max-w-none"
                        >
                            <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-12"
                                >
                                    <div>
                                        <h2 className="text-3xl font-bold mb-6 text-primary border-b pb-4">{t('Projectdetails.Description')}</h2>
                                        <div className="text-lg leading-relaxed text-muted-foreground">
                                            {project.description}
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold mb-6 text-primary border-b pb-4">{t('Projectdetails.Requirements')}</h2>
                                        <ul className="list-none space-y-4">
                                            {project.prerequisites?.map((prereq: string, index: number) => (
                                                <motion.li
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * index }}
                                                    className="flex items-start group"
                                                >
                                                    <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3 group-hover:scale-125 transition-transform" />
                                                    <span className="text-lg text-muted-foreground">{prereq}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h2 className="text-3xl font-bold mb-6 text-primary border-b pb-4">{t('Projectdetails.Outcomes')}</h2>
                                        <ul className="list-none space-y-4">
                                            {project.outcomes?.map((outcome: string, index: number) => (
                                                <motion.li
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * index }}
                                                    className="flex items-start group"
                                                >
                                                    <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3 group-hover:scale-125 transition-transform" />
                                                    <span className="text-lg text-muted-foreground">{outcome}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        <ErrorBoundary fallback={<div className="p-4 bg-destructive/10 rounded-lg">{t('ErrorBoundary.message')}</div>}>
                            <Suspense fallback={<div className="flex justify-center p-8"><LoadingSpinner /></div>}>
                                <CurriculumSection curriculum={project.curriculum} />
                            </Suspense>
                        </ErrorBoundary>
                    </div>

                    <div className="hidden lg:block lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="sticky top-24"
                        >
                            <Card className="p-8 shadow-xl border-2 hover:border-primary transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                                <h3 className="text-2xl font-bold mb-4 text-primary">{t('Projectdetails.Enroll.title')}</h3>
                                <p className="text-muted-foreground mb-8">{t('Projectdetails.Enroll.description')}</p>
                                <div className="space-y-6">
                                    <Button
                                        className="w-full text-lg font-semibold"
                                        size="lg"
                                        onClick={() => {
                                            router.push(channelCode ? `/checkout?channel=${channelCode}` : '/checkout');
                                        }}
                                    >
                                        {t('Projectdetails.Enroll.button')}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Purchase Button */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t z-50 shadow-lg">
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="container mx-auto p-4 flex items-center justify-center"
                >
                    <Button
                        size="lg"
                        className="text-lg font-semibold px-8"
                        onClick={() => {
                            router.push('/checkout');
                        }}
                    >
                        {t('Projectdetails.Enroll.button')}
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}