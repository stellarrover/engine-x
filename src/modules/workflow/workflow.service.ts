import { Injectable } from '@nestjs/common';
import { CreateWorkflowInput } from './models/dto/create-workflow.input';
import { UpdateWorkflowInput } from './models/dto/update-workflow.input';

@Injectable()
export class WorkflowService {
  create(createWorkflowInput: CreateWorkflowInput) {
    return 'This action adds a new workflow';
  }

  findAll() {
    return `This action returns all workflow`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workflow`;
  }

  update(id: number, updateWorkflowInput: UpdateWorkflowInput) {
    return `This action updates a #${id} workflow`;
  }

  remove(id: number) {
    return `This action removes a #${id} workflow`;
  }
}
