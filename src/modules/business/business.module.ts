import { Module } from '@nestjs/common';
import { WorkflowModule } from './workflow/workflow.module';
import { ProcessModule } from './process/process.module';
import { AgentModule } from './ai-agent/agent.module';

@Module({
  imports: [WorkflowModule, ProcessModule, AgentModule],
})
export class BusinessModule {}
