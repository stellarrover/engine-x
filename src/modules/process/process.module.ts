import { Module } from '@nestjs/common';
import { ProcessBlockService } from './services/process-block.service';
import { ProcessService } from './process/process.service';
import { ProcessService } from './process.service';

/**
 * Process module
 * 专注于流程的执行功能
 */
@Module({
  providers: [ProcessBlockService, ProcessService],
})
export class ProcessModule {}
