import { Injectable } from '@nestjs/common';
import { FileUploadManagerInterface } from '../file-upload.manager';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import { STORAGE_PATH, STORAGE_WITHOUT_HOST } from 'src/common/config';
import { enginePath, engineURL } from '@utils';
import mime from 'mime';

@Injectable()
export class LocalManager implements FileUploadManagerInterface {
  async upload(key: string, inputStream: Readable): Promise<string> {
    fs.mkdirSync(STORAGE_PATH, { recursive: true });
    fs.mkdirSync(path.resolve(STORAGE_PATH, path.dirname(key)), {
      recursive: true,
    });
    const stream = fs.createWriteStream(path.resolve(STORAGE_PATH, key));
    inputStream.pipe(stream);
    if (STORAGE_WITHOUT_HOST) {
      return enginePath(`/files/${key}`);
    } else {
      return engineURL(`/files/${key}`);
    }
  }

  async readFile(key: string) {
    if (!fs.existsSync(path.resolve(STORAGE_PATH, key))) return;
    const file = fs.createReadStream(path.resolve(STORAGE_PATH, key));
    return {
      data: file,
      length: (await fs.promises.stat(path.resolve(STORAGE_PATH, key))).size,
      type: (mime.lookup(key) as string) ?? 'application/octet-stream',
    };
  }

  rootPath = () =>
    STORAGE_WITHOUT_HOST ? enginePath(`/files`) : engineURL(`/files`);
}
