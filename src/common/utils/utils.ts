import { cloneDeep } from 'lodash';
import { SafeJsonType } from 'safe-json-type';
import { APP_HOST, APP_PREFIX } from '../config';
import { Readable } from 'stream';

/**
 * 序列化
 * @param value
 * @returns
 */
export function serialize(value: any) {
  return SafeJsonType.stringify(cloneDeep(value));
}

/**
 * 反序列化
 * @param value
 * @returns
 */
export function deserialize<T = any>(value: string) {
  return SafeJsonType.parse(value) as T;
}

export function wait(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function enginePath(path: string): string {
  let prefix = APP_PREFIX;
  if (prefix.endsWith('/')) prefix = prefix.slice(0, -1);
  if (prefix.startsWith('/')) prefix = prefix.slice(1);
  if (path.startsWith('/')) path = path.slice(1);
  return prefix === '' ? `/${path}` : `/${prefix}/${path}`;
}

export function engineURL(url: string): string {
  let host = APP_HOST;
  let prefix = APP_PREFIX;
  if (host.endsWith('/')) host = host.slice(0, -1);
  if (prefix.endsWith('/')) prefix = prefix.slice(0, -1);
  if (prefix.startsWith('/')) prefix = prefix.slice(1);
  if (url.startsWith('/')) url = url.slice(1);

  return prefix === '' ? `${host}/${url}` : `${host}/${prefix}/${url}`;
}

export async function stream2buffer(stream: Readable): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const _buf = Array<any>();
    stream.on('data', (chunk) => _buf.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(_buf)));
    stream.on('error', (err) => reject(`error converting stream - ${err}`));
  });
}
