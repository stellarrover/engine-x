import { cloneDeep } from 'lodash';
import { SafeJsonType } from 'safe-json-type';

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
