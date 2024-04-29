import { Module } from '@nestjs/common';
import { AiSchedulerService } from './ai-scheduler.service';

@Module({
  providers: [AiSchedulerService]
})
export class AiSchedulerModule {}
