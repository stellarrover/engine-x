import { Module } from '@nestjs/common';
import { WorkflowParamsService } from './workflow-params.service';
import { WorkflowParamsResolver } from './workflow-params.resolver';

@Module({
  providers: [WorkflowParamsResolver, WorkflowParamsService],
})
export class WorkflowParamsModule {}
