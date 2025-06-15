/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2025-03-24 00:00:00
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-03-26 01:11:15
 * @FilePath: /lulab_website_next_js/app/api/curriculums/route.ts
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/connection';

// Get all curriculums or filter by project_id
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('project_id');

        let result;
        if (projectId) {
            result = await sql`
                SELECT * FROM curriculums
                WHERE project_id = ${projectId}
                ORDER BY week
            `;
        } else {
            result = await sql`
                SELECT * FROM curriculums
                ORDER BY week
            `;
        }
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching curriculums:', error);
        return NextResponse.json({ error: 'Failed to fetch curriculums' }, { status: 500 });
    }
}

// Create new curriculum
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { project_id, title, description, week, topics, goals } = body;

        const result = await sql`
      INSERT INTO curriculums (project_id, title, description, week, topics, goals)
      VALUES (
        ${project_id}, 
        ${title}, 
        ${description}, 
        ${week}, 
        ${JSON.stringify(topics)},
        ${JSON.stringify(goals)}
      )
      RETURNING *
    `;

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error creating curriculum:', error);
        return NextResponse.json({ error: 'Failed to create curriculum' }, { status: 500 });
    }
}

// Update curriculum
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, description, week, topics, goals } = body;

        const result = await sql`
      UPDATE curriculums
      SET title = ${title},
          description = ${description},
          week = ${week},
          topics =  ${JSON.stringify(topics)},
          goals = ${JSON.stringify(goals)}
      WHERE id = ${id}
      RETURNING *
    `;

        if (result.length === 0) {
            return NextResponse.json({ error: 'Curriculum not found' }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error updating curriculum:', error);
        return NextResponse.json({ error: 'Failed to update curriculum' }, { status: 500 });
    }
}

// Delete curriculum
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Curriculum ID is required' }, { status: 400 });
        }

        const result = await sql`
      DELETE FROM curriculums
      WHERE id = ${id}
      RETURNING id
    `;

        if (result.length === 0) {
            return NextResponse.json({ error: 'Curriculum not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Curriculum deleted successfully' });
    } catch (error) {
        console.error('Error deleting curriculum:', error);
        return NextResponse.json({ error: 'Failed to delete curriculum' }, { status: 500 });
    }
}