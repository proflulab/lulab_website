/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2025-03-25 19:21:04
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-03-26 12:14:22
 * @FilePath: /lulab_website_next_js/app/[locale]/(no-chrome)/admin/projects/curriculum/page.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CurriculumFormDialog from '@/components/admin/project/curriculum/CurriculumFormDialog';
import AdminLayout from '@/components/admin/AdminLayout';
import { Curriculum } from '@/types';


export default function CurriculumPage() {
    const searchParams = useSearchParams();
    const projectId = searchParams?.get('projectId');
    const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCurriculumForm, setShowCurriculumForm] = useState(false);
    const [editingCurriculum, setEditingCurriculum] = useState<Curriculum | null>(null);

    useEffect(() => {
        if (projectId) {
            fetchCurriculums(projectId);
        }
    }, [projectId]);

    const fetchCurriculums = async (projectId: string) => {
        try {
            const response = await fetch(`/api/curriculums?project_id=${projectId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch curriculums');
            }
            const data = await response.json();
            // 确保数据是数组并且每个curriculum的topics也是数组
            const processedData = Array.isArray(data) ? data.map(item => ({
                ...item,
                topics: Array.isArray(item.topics) ? item.topics : (item.topics ? [item.topics] : [])
            })) : [];
            setCurriculums(processedData);
        } catch (error) {
            console.error('Error fetching curriculums:', error);
            setError('Failed to fetch curriculums');
        } finally {
            setLoading(false);
        }
    };

    const handleCurriculumSubmit = async (curriculum: Curriculum) => {
        try {
            // 确保topics是数组
            const processedCurriculum = {
                ...curriculum,
                topics: Array.isArray(curriculum.topics) ? curriculum.topics : (curriculum.topics ? [curriculum.topics] : [])
            };

            const method = processedCurriculum.id ? 'PUT' : 'POST';
            const response = await fetch('/api/curriculums', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(processedCurriculum),
            });

            if (!response.ok) {
                throw new Error('Failed to save curriculum');
            }

            if (projectId) {
                fetchCurriculums(projectId);
            }
            setShowCurriculumForm(false);
            setEditingCurriculum(null);
        } catch (error) {
            console.error('Error saving curriculum:', error);
        }
    };

    const handleCurriculumDelete = async (curriculumId: string) => {
        if (!confirm('Are you sure you want to delete this curriculum?')) return;

        try {
            const response = await fetch(`/api/curriculums?id=${curriculumId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete curriculum');
            }

            if (projectId) {
                fetchCurriculums(projectId);
            }
        } catch (error) {
            console.error('Error deleting curriculum:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-destructive">{error}</div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="container mx-auto py-8">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Curriculum Management</h2>
                        <Button onClick={() => setShowCurriculumForm(true)}>
                            Add Curriculum
                        </Button>
                    </div>

                    {loading && (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {curriculums.map((curriculum) => (
                            <Card key={curriculum.id}>
                                <CardHeader>
                                    <CardTitle>Week {curriculum.week}: {curriculum.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4">{curriculum.description}</p>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold">Topics:</h4>
                                        <ul className="list-disc list-inside">
                                            {curriculum.topics && Array.isArray(curriculum.topics) ? (
                                                curriculum.topics.map((topic, index) => (
                                                    <li key={index}>{topic}</li>
                                                ))
                                            ) : (
                                                <li>No topics available</li>
                                            )}
                                        </ul>
                                        {curriculum.goals && Array.isArray(curriculum.goals) && curriculum.goals.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold mt-4">Goals:</h4>
                                                <ul className="list-disc list-inside">
                                                    {curriculum.goals.map((goal, index) => (
                                                        <li key={index}>{goal}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setEditingCurriculum(curriculum);
                                            setShowCurriculumForm(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => curriculum.id && handleCurriculumDelete(curriculum.id)}
                                    >
                                        Delete
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <CurriculumFormDialog
                        isOpen={showCurriculumForm}
                        onClose={() => {
                            setShowCurriculumForm(false);
                            setEditingCurriculum(null);
                        }}
                        curriculum={editingCurriculum || undefined}
                        projectId={projectId || ''}
                        onSubmit={handleCurriculumSubmit}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}