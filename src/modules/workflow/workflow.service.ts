import { Injectable } from '@nestjs/common';
import { isArray, isObject } from 'lodash';
import { PrismaService } from 'src/core/services/prisma';
import { CreateWorkflowInput } from './types/create-workflow-input.type';
import { UpdateWorkflowInput } from './types/update-workflow-input.type';
import { WorkflowRepository } from './workflow.repository';

@Injectable()
export class WorkflowService {
  constructor(
    private readonly repository: WorkflowRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Creates a new workflow.
   * The method uses a transaction to ensure that the creation of the workflow and the resetting of the aliases and muLinList are atomic.
   * If the aliases or muLinList are arrays or objects, they are reset.
   * @param {CreateWorkflowInput} input Which contains the user, muLinList, aliases, and other data.
   * @returns The created workflow.
   */
  async create(input: CreateWorkflowInput) {
    const { user, muLinList, aliases, ...data } = input;

    return this.prisma.$transaction(async (tx) => {
      const workflow = await this.repository.createWorkflow(tx, input.user.id, data);

      if (isArray(aliases)) {
        await this.repository.resetWorkflowAliases(tx, workflow.id, aliases);
      }

      if (isObject(muLinList)) {
        await this.repository.resetWorkflowMuLinList(tx, workflow.id, muLinList);
      }

      return workflow;
    });
  }

  getMany() {
    return `This action returns all workflow`;
  }

  async findOne(id: string) {
    return await this.repository.findWorkflow(id);
  }

  async update(id: string, input: UpdateWorkflowInput) {
    const { user, muLinList, aliases, ...data } = input;

    return this.prisma.$transaction(async (tx) => {
      const workflow = await this.repository.updateWorkflow(tx, user.id, id, data);

      if (isArray(aliases)) {
        await this.repository.resetWorkflowAliases(tx, id, aliases);
      }

      if (isObject(muLinList)) {
        await this.repository.resetWorkflowMuLinList(tx, id, muLinList);
      }

      return workflow;
    });
  }

  remove(id: number) {
    return `This action removes a #${id} workflow`;
  }

  duplicate() {}

  recover() {}

  delete() {}
}
