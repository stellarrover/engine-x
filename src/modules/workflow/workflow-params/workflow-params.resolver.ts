import { Resolver } from '@nestjs/graphql';
import { WorkflowParamsService } from './workflow-params.service';

@Resolver()
export class WorkflowParamsResolver {
  constructor(private readonly workflowParamsService: WorkflowParamsService) {}
}
