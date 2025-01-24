import { Module } from '@nestjs/common';
import { WorkflowMuLinListFactory } from './factories/workflow-mulinlist.factory';
import { WorkflowRepository } from './workflow.repository';
import { WorkflowService } from './workflow.service';

/**
 * Workflow module
 * 专注于流程的持久化功能
 * @description 1. 流程由一系列组件组成(如UI组件、AI组件、逻辑组件等)
 * @description 2. 数据结构采用多重链表的形式：Multi-Linked List
 * @description 3. 通过节点的输入输出关系，实现组件之间的数据传递
 */
@Module({
  providers: [WorkflowService, WorkflowRepository, WorkflowMuLinListFactory],
  exports: [WorkflowService],
})
export class WorkflowModule {}
