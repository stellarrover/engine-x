import { Logger } from '@nestjs/common';
import { BootStrap } from '../../common/cluster';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ProcessModule } from './process.module';
import { GlobalExtension } from '@global';
import 'dotenv/config';

const { ENVIRONMENT: env } = process.env;

if (env === 'local') {
  process.env.PORT = '5001';
}

export class ProcessBootstrap {
  static logger: Logger = new Logger(ProcessBootstrap.name);
  static async start() {
    GlobalExtension.init();

    const app = await NestFactory.create<NestExpressApplication>(ProcessModule);
    const port = parseInt(process.env.PORT || '4000');

    await app.listen(port);
  }
}

BootStrap(ProcessBootstrap);
