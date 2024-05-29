import { Module } from '@nestjs/common';
import { CombinedFlowParamService } from './combined-flow-param.service';
import { CombinedFlowParamRepository } from './combined-flow-param.repository';

@Module({
  providers: [CombinedFlowParamRepository, CombinedFlowParamService],
})
export class CombinedFlowParamModule {}
