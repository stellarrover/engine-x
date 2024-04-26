import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { LocalManager } from './adapters/local.manager';
import { S3Manager } from './adapters/s3.manager';
import { VolcengineManager } from './adapters/volcengine.manager';
import { STORAGE_ADAPTER } from 'src/common/config';

export interface FileUploadManagerInterface {
  upload(key: string, stream: Readable, contentType?: string): Promise<string>;

  readFile(
    key: string,
  ): Promise<{ data: Readable; length: number; type: string } | void>;

  rootPath(): string;
}

@Injectable()
export class FileUploadManager implements FileUploadManagerInterface {
  private uploader: FileUploadManagerInterface;

  constructor() {
    // TODO remove 硬编码
    switch (STORAGE_ADAPTER) {
      case 's3':
        this.uploader = new S3Manager();
        break;
      case 'volcengine':
        this.uploader = new VolcengineManager();
        break;
      default:
        this.uploader = new LocalManager();
    }
  }

  upload(key: string, stream: Readable, contentType?: string): Promise<string> {
    return this.uploader.upload(key, stream, contentType);
  }

  readFile(
    key: string,
  ): Promise<void | { data: Readable; length: number; type: string }> {
    return this.uploader.readFile(key);
  }

  rootPath(): string {
    return this.uploader.rootPath();
  }
}
