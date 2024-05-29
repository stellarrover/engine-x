import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { ProcessResolver } from './process.resolver';
import { ProcessResultModule } from './process-result/process-result.module';
import { ProcessLabelModule } from './process-label/process-label.module';
import { RunTimeCacheModule } from './run-time-cache/run-time-cache.module';

@Module({
  providers: [ProcessResolver, ProcessService],
  imports: [ProcessResultModule, ProcessLabelModule, RunTimeCacheModule],
})
export class ProcessModule {}
