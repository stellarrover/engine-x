import { Injectable } from '@nestjs/common';
import { FileUploadManagerInterface } from '../file-upload.manager';
import { Readable } from 'stream';
import { enginePath, stream2buffer } from 'src/common/utils/utils';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  S3_ACCESS_KEY,
  S3_ACCESS_SECRET,
  S3_STORAGE_BUCKET,
  S3_STORAGE_ENDPOINT,
  STORAGE_PATH,
} from 'src/common/config';

@Injectable()
export class S3Manager implements FileUploadManagerInterface {
  private _client: S3Client;
  private BUCKET_NAME = S3_STORAGE_BUCKET ?? 'engine';

  private get client() {
    if (!this.client) {
      this._client = new S3Client({
        credentials: {
          accessKeyId: S3_ACCESS_KEY,
          secretAccessKey: S3_ACCESS_SECRET,
        },
        endpoint: S3_STORAGE_ENDPOINT,
        forcePathStyle: true,
        region: 'engine',
      });
    }
    return this._client;
  }

  async upload(key: string, inputStream: Readable, contentType) {
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.BUCKET_NAME,
          Body: await stream2buffer(inputStream),
          ContentType: contentType,
          Key: key,
        }),
      );
      return enginePath(`/api/file/s3/${key}`);
    } catch (error) {
      throw error;
    }
  }

  async readFile(key: string) {
    const result = await this.client.send(
      new GetObjectCommand({ Bucket: this.BUCKET_NAME, Key: key }),
    );
    return {
      data: Readable.fromWeb(result.Body.transformToWebStream() as any),
      length: result.ContentLength ?? 0,
      type: result.ContentType ?? '',
    };
  }

  rootPath = () => STORAGE_PATH;
}
