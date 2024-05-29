import { Resolver } from '@nestjs/graphql';
import { WorkflowService } from './workflow.service';

@Resolver()
export class WorkflowResolver {
  constructor(private readonly workflowService: WorkflowService) {}
}
