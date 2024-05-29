import { Module } from '@nestjs/common';
import { ProcessResultService } from './process-result.service';
import { ProcessResultResolver } from './process-result.resolver';

@Module({
  providers: [ProcessResultResolver, ProcessResultService],
})
export class ProcessResultModule {}
