import { Module } from '@nestjs/common';
import { ProcessBlockService } from './services/process-block.service';

/**
 * Process module
 * 专注于流程的执行功能
 */
@Module({
  providers: [ProcessBlockService],
})
export class ProcessModule {}
