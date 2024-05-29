import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowResolver } from './workflow.resolver';
import { WorkflowAliasModule } from './workflow-alias/workflow-alias.module';
import { WorkflowParamsModule } from './workflow-params/workflow-params.module';

@Module({
  providers: [WorkflowResolver, WorkflowService],
  imports: [WorkflowAliasModule, WorkflowParamsModule],
})
export class WorkflowModule {}
