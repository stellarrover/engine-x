import { Module } from '@nestjs/common';
import { AiSchedulerModule } from './ai-scheduler/ai-scheduler.module';
import { ProcessSchedulerModule } from './process-scheduler/process-scheduler.module';

@Module({
  imports: [AiSchedulerModule, ProcessSchedulerModule],
})
export class SchedulerModule {}
