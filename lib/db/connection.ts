import { neon } from '@neondatabase/serverless';

// 创建数据库连接
export function createDbConnection() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please add DATABASE_URL to your environment variables. ' +
      'For local development, create a .env.local file with your database connection string.'
    );
  }
  
  return neon(databaseUrl);
}

// 导出数据库连接实例
export const sql = createDbConnection();