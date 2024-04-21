import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export abstract class FileUploadManager {
  constructor() {}

  abstract upload(
    key: string,
    stream: Readable,
    contentType?: string,
  ): Promise<string>;

  abstract readFile(
    key: string,
  ): Promise<{ data: Readable; length: number; type: string } | void>;

  abstract rootPath: string;
}
