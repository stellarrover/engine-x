import { Module } from '@nestjs/common';
import { ProcessLabelService } from './process-label.service';
import { ProcessLabelResolver } from './process-label.resolver';

@Module({
  providers: [ProcessLabelResolver, ProcessLabelService],
})
export class ProcessLabelModule {}
