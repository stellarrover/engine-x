import { Module } from '@nestjs/common';
import { AuthProxyModule } from './modules/auth-proxy/auth-proxy.module';

@Module({
  imports: [AuthProxyModule],
  exports: [AuthProxyModule],
})
export class CoreModule {}
