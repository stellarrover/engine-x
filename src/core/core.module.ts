import { Module } from '@nestjs/common';
import { AuthProxyModule } from './modules/auth-proxy/auth-proxy.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';

// CoreModule is a module that imports and exports other modules that are used across the application.
@Module({
  imports: [AuthProxyModule, FileUploadModule],
  exports: [AuthProxyModule, FileUploadModule],
})
export class CoreModule {}
