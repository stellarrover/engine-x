import { Module } from '@nestjs/common';
import { ProcessBlockService } from './services/process-block.service';

@Module({
  providers: [ProcessBlockService],
})
/**
 * Process module
 * 专注于流程的执行功能
 */
export class ProcessModule {}
