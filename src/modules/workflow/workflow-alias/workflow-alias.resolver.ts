import { Resolver } from '@nestjs/graphql';
import { WorkflowAliasService } from './workflow-alias.service';

@Resolver()
export class WorkflowAliasResolver {
  constructor(private readonly workflowAliasService: WorkflowAliasService) {}
}
