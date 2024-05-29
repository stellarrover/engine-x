import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { WorkflowMultipleLinkedListFactoryOptions } from './models/workflow-multiple-linked-list.factory';
import { WorkflowMultipleLinkedList } from './models/workflow-multiple-linked-list.model';
import { WorkflowMultipleLinkedNode } from './models/workflow-multiple-linked-node.model';
import { PrismaService } from 'src/core/services/prisma';

@Injectable()
export class CombinedStructureRepository {
  constructor(private readonly prisma: PrismaService) {}
  async upsertWorkflowNodes(
    multipleLinkedList: WorkflowMultipleLinkedList,
    combinedFlowId: string,
    isUpdate = false,
  ) {
    const transaction = [];

    transaction.push(
      this.prisma.workflowNode.deleteMany({
        where: {
          combinedFlowId,
        },
      }),
    );

    multipleLinkedList.toPrismaCreateInputs().map((item) => {
      const { inputs, outputs, ...data } = item;
      transaction.push(
        this.prisma.workflowNode.create({
          data: {
            ...data,
            combinedFlowId,
          },
        }),
      );

      isUpdate &&
        transaction.push(
          this.prisma.workflowNodeInput.createMany({
            data: inputs.map((input) => ({
              ...input,
            })),
          }),
          this.prisma.workflowNodeOutput.createMany({
            data: outputs.map((output) => ({
              ...output,
            })),
          }),
        );
    });

    await this.prisma.$transaction(transaction);
  }

  async delWorkflowNodes(id: string, permanent: boolean) {
    if (permanent) {
      await this.prisma.workflowNode.deleteMany({
        where: {
          combinedFlowId: id,
        },
      });
    } else {
      await this.prisma.workflowNode.updateMany({
        where: {
          combinedFlowId: id,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      });
    }
  }

  /**
   * 根据组合流程ID获取多重链表节点数组
   * @param combinedFlowId
   * @param options
   * @returns
   */
  async getWorkflowMultipleLinkedNodesByCombinedFlowId(
    combinedFlowId: string,
    options?: WorkflowMultipleLinkedListFactoryOptions,
    paramIdMapping?: Map<string, string>,
  ): Promise<WorkflowMultipleLinkedNode[]> {
    const { isRandomId = false, withEntity = false } = options || {};

    const includeFields = withEntity
      ? {
          atomFlow: true,
          component: true,
        }
      : {};

    // 获取所有节点
    const nodes = await this.prisma.workflowNode.findMany({
      where: {
        combinedFlowId,
      },
      include: {
        inputs: {
          select: {
            id: true,
            paramId: true,
            usingPromptLabel: true,
          },
        },
        outputs: {
          where: {
            param: {
              OR: [
                { atomFlowOutputId: null },
                {
                  atomFlowOutput: {
                    deleted: false,
                  },
                },
              ],
            },
          },
          select: {
            id: true,
            paramId: true,
          },
        },
        ...includeFields,
      },
    });

    if (isRandomId) {
      const idMapping = new Map<string, string>();

      nodes.forEach((node) => {
        idMapping.set(node.id, nanoid());
      });

      nodes.forEach((node) => {
        node.id = idMapping.get(node.id)!;
        node.nextId && (node.nextId = idMapping.get(node.nextId) ?? null);
        node.parentId && (node.parentId = idMapping.get(node.parentId) ?? null);

        if (paramIdMapping) {
          node.outputs.forEach((output) => {
            output.id = nanoid();
            output.paramId = paramIdMapping.get(output.paramId)!;
          });

          node.inputs.forEach((input) => {
            input.id = nanoid();
            input.paramId = paramIdMapping.get(input.paramId) ?? '';
          });
        }
      });
    }

    return nodes.map((node) => new WorkflowMultipleLinkedNode(node));
  }
}
