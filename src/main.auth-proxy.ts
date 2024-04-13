import { Logger } from '@nestjs/common';
import { BootStrap } from './common/cluster';

class AuthProxyBootstrap {
  static logger: Logger = new Logger(AuthProxyBootstrap.name);
  static async start() {}
}

BootStrap(AuthProxyBootstrap);
