import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WorkflowService } from './workflow.service';
import { Workflow } from './models/entities/workflow.entity';
import { CreateWorkflowInput } from './models/dto/create-workflow.input';
import { UpdateWorkflowInput } from './models/dto/update-workflow.input';

@Resolver(() => Workflow)
export class WorkflowResolver {
  constructor(private readonly workflowService: WorkflowService) {}

  @Mutation(() => Workflow)
  createWorkflow(
    @Args('createWorkflowInput') createWorkflowInput: CreateWorkflowInput,
  ) {
    return this.workflowService.create(createWorkflowInput);
  }

  @Query(() => [Workflow], { name: 'workflow' })
  findAll() {
    return this.workflowService.findAll();
  }

  @Query(() => Workflow, { name: 'workflow' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.workflowService.findOne(id);
  }

  @Mutation(() => Workflow)
  updateWorkflow(
    @Args('updateWorkflowInput') updateWorkflowInput: UpdateWorkflowInput,
  ) {
    return this.workflowService.update(
      updateWorkflowInput.id,
      updateWorkflowInput,
    );
  }

  @Mutation(() => Workflow)
  removeWorkflow(@Args('id', { type: () => Int }) id: number) {
    return this.workflowService.remove(id);
  }
}
