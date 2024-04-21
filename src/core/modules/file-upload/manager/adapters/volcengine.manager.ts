import { Injectable } from '@nestjs/common';
import { FileUploadManager } from '../file-upload.manager';
import { Readable } from 'stream';
import { stream2buffer } from '@utils';
import TosClient from '@volcengine/tos-sdk';
import {
  VOLCENGINE_ACCESS_KEY,
  VOLCENGINE_ACCESS_SECRET,
  VOLCENGINE_STORAGE_REGION,
  VOLCENGINE_STORAGE_ENDPOINT,
  VOLCENGINE_STORAGE_BUCKET,
  VOLCENGINE_CDN_HOST,
} from 'src/common/config';

@Injectable()
export class VolcengineManager extends FileUploadManager {
  private _client: TosClient;

  private get client() {
    if (!this._client) {
      this._client = new TosClient({
        accessKeyId: VOLCENGINE_ACCESS_KEY,
        accessKeySecret: VOLCENGINE_ACCESS_SECRET,
        region: VOLCENGINE_STORAGE_REGION,
        endpoint: VOLCENGINE_STORAGE_ENDPOINT,
        bucket: VOLCENGINE_STORAGE_BUCKET,
      });
    }
    return this._client;
  }

  async upload(key: string, inputStream: Readable) {
    await this.client.uploadFile({
      file: await stream2buffer(inputStream),
      key,
    });
    return VOLCENGINE_CDN_HOST + key;
  }

  async readFile(key: string) {
    const file = await this.client.getObjectV2({ key });
    const stream = file.data.content;
    return {
      data: stream as Readable,
      length: +(file.headers.ContentLength ?? 0),
      type: file.headers.ContentType ?? '',
    };
  }

  rootPath = VOLCENGINE_CDN_HOST;
}
