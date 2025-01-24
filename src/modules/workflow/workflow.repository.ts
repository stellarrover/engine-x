import { Injectable } from '@nestjs/common';
import { Prisma, Workflow } from '@prisma/client';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/core/services/prisma';
import { XMuLinList } from './models/workflow-mulinlist.model';

@Injectable()
export class WorkflowRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWorkflow(
    tx: Prisma.TransactionClient,
    userId: string,
    input: Omit<
      Workflow,
      'id' | 'createdAt' | 'updatedAt' | 'deleted' | 'deletedAt' | 'creatorId' | 'lastEditorId' | 'version'
    >,
  ) {
    const workflow = await tx.workflow.create({
      data: {
        id: nanoid(),
        creatorId: userId,
        lastEditorId: userId,
        ...input,
      },
    });

    return workflow;
  }

  async resetWorkflowAliases(tx: Prisma.TransactionClient, workflowId: string, aliases: string[]) {
    await tx.workflowAlias.deleteMany({ where: { workflowId } });

    const data = aliases.map((alias) => ({
      workflowId,
      id: nanoid(),
      alias,
    }));

    if (aliases.length) {
      await tx.workflowAlias.createMany({ data });
    }
  }

  async resetWorkflowMuLinList(tx: Prisma.TransactionClient, workflowId: string, muLinList: XMuLinList) {}

  async findWorkflow(workflowId: string) {
    return await this.prisma.workflow.findUnique({
      where: { id: workflowId },
      include: {
        aliases: true,
        scenarios: true,
        params: true,
      },
    });
  }

  async updateWorkflow(
    tx: Prisma.TransactionClient,
    userId: string,
    workflowId: string,
    input: Partial<
      Omit<
        Workflow,
        'id' | 'createdAt' | 'updatedAt' | 'deleted' | 'deletedAt' | 'creatorId' | 'lastEditorId' | 'version'
      >
    >,
  ) {
    return await tx.workflow.update({
      where: { id: workflowId },
      data: {
        lastEditorId: userId,
        ...input,
      },
    });
  }
}
