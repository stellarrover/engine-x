import { Module } from '@nestjs/common';
import { WorkflowAliasService } from './workflow-alias.service';
import { WorkflowAliasResolver } from './workflow-alias.resolver';

@Module({
  providers: [WorkflowAliasResolver, WorkflowAliasService],
})
export class WorkflowAliasModule {}
