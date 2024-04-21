import path from 'path';
import 'dotenv/config';

export const APP_HOST = process.env.APP_HOST ?? 'http://127.0.0.1';
export const APP_PREFIX = process.env.APP_PREFIX ?? '';

// 是否开启GRAPHQL自省和调试控制台
export const GRAPHQL_DEV_TOOLS = process.env.GRAPHQL_DEV_TOOLS === 'true';

// STORAGE ⬇
export const STORAGE_ADAPTER = process.env.STORAGE_ADAPTER ?? 'local';
export const STORAGE_PATH =
  process.env.STORAGE_PATH ?? path.resolve(__dirname, `../public/`);
export const STORAGE_WITHOUT_HOST = process.env.STORAGE_WITHOUT_HOST;

// S3
export const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY!;
export const S3_ACCESS_SECRET = process.env.S3_ACCESS_SECRET!;
export const S3_STORAGE_BUCKET = process.env.S3_STORAGE_BUCKET!;
export const S3_STORAGE_ENDPOINT = process.env.S3_STORAGE_ENDPOINT!;
export const S3_CACHE_MAX_SIZE = +(
  process.env.S3_CACHE_MAX_SIZE ?? '536870912'
);

// 火山引擎
export const VOLCENGINE_ACCESS_KEY = process.env.VOLCENGINE_ACCESS_KEY!;
export const VOLCENGINE_ACCESS_SECRET = process.env.VOLCENGINE_ACCESS_SECRET!;
export const VOLCENGINE_STORAGE_REGION = process.env.VOLCENGINE_STORAGE_REGION!;
export const VOLCENGINE_STORAGE_BUCKET = process.env.VOLCENGINE_STORAGE_BUCKET!;
export const VOLCENGINE_STORAGE_ENDPOINT =
  process.env.VOLCENGINE_STORAGE_ENDPOINT;
export const VOLCENGINE_CDN_HOST = process.env.VOLCENGINE_CDN_HOST!;
// STORAGE ⬆
