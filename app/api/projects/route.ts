/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2025-01-09 02:38:19
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-01-10 01:37:22
 * @FilePath: /lulab_website_next_js/app/api/projects/route.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/connection';

export async function GET() {
    try {
        const result = await sql`
      SELECT id, slug, title, subtitle, category, image, duration, level, max_students AS "maxStudents", description, prerequisites, outcomes
      FROM projects
    `;
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const project = await request.json();
        const maxStudents = parseInt(project.max_students) || 25;
        const result = await sql`
            INSERT INTO projects (
                title, subtitle, category, image, duration, level, max_students, description, slug, prerequisites, outcomes
            ) VALUES (
                ${project.title}, ${project.subtitle}, ${project.category}, ${project.image},
                ${project.duration}, ${project.level}, ${maxStudents}, ${project.description},
                ${project.slug}, ${JSON.stringify(project.prerequisites)}, ${JSON.stringify(project.outcomes)}
            )
            RETURNING id, title, subtitle, category, image, duration, level, max_students AS "maxStudents", description, slug, prerequisites, outcomes
        `;
        return NextResponse.json(result[0]);

    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const project = await request.json();
        const maxStudents = parseInt(project.max_students) || 25;

        if (!id) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        const result = await sql`
            UPDATE projects
            SET title = ${project.title},
                subtitle = ${project.subtitle},
                category = ${project.category},
                image = ${project.image},
                duration = ${project.duration},
                level = ${project.level},
                max_students = ${maxStudents},
                description = ${project.description},
                slug = ${project.slug},
                prerequisites = ${JSON.stringify(project.prerequisites)},
                outcomes = ${JSON.stringify(project.outcomes)}
            WHERE id = ${id}
            RETURNING id, title, subtitle, category, image, duration, level, max_students AS "maxStudents", description, slug, prerequisites, outcomes
        `;

        if (result.length === 0) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        await sql`DELETE FROM projects WHERE id = ${id}`;
        return NextResponse.json({ message: 'Project deleted successfully' });

    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}