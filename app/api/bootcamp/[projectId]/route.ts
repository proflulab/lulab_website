/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2025-01-09 04:00:58
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-01-10 01:56:03
 * @FilePath: /lulab_website_next_js/app/api/bootcamp/[projectId]/route.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/connection';

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
    const { projectId } = params;

    // 查询项目基本信息
    const [project] = await sql`
    SELECT id, title, slug, subtitle, description, category, duration, level, max_students, prerequisites, outcomes
    FROM projects
    WHERE slug = ${projectId}
  `;

    // 如果项目不存在，返回 404 错误
    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 查询项目的目录（课程内容）
    const curriculum = await sql`
    SELECT title, topics, goals, description, week
    FROM curriculums
    WHERE project_id = ${project.id}
    ORDER BY week
  `;

return NextResponse.json({ project: { ...project, curriculum } });
}