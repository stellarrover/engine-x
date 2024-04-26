import { Module } from '@nestjs/common';
import { WorkflowResolver } from './workflow.resolver';
import { WorkflowService } from './workflow.service';

/**
 * Workflow module
 * 专注于流程的持久化功能
 */
@Module({
  providers: [WorkflowResolver, WorkflowService],
})
export class WorkflowModule {}
