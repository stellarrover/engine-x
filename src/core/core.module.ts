import { Module } from '@nestjs/common';
import { AuthProxyModule } from './modules/auth-proxy/auth-proxy.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';

@Module({
  imports: [AuthProxyModule, FileUploadModule],
  exports: [AuthProxyModule, FileUploadModule],
})
export class CoreModule {}
