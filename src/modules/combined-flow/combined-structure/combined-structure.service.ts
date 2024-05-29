import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { BuilderInputNode, BuilderInputEdge } from '../types/combinedFlow.dto';
import { CombinedStructureRepository } from './combined-structure.repository';
import { WorkflowMultipleLinkedListFactory } from './models/workflow-multiple-linked-list.factory';
import { WorkflowMultipleLinkedNode } from './models/workflow-multiple-linked-node.model';
import { ConvertUtils } from './utils/convert.utils';
import { PrismaService } from 'src/core/services/prisma';

@Injectable()
export class CombinedStructureService {
  constructor(
    private repository: CombinedStructureRepository,
    private readonly workflowMultipleLinkedListFactory: WorkflowMultipleLinkedListFactory,
    private readonly prisma: PrismaService,
  ) {}

  async createWorkflowNodes(
    combineWorkflowIds: string[],
    combinedFlowId: string,
  ) {
    const multipleLinkedList =
      await this.workflowMultipleLinkedListFactory.buildByIds(
        combineWorkflowIds,
      );

    await this.repository.upsertWorkflowNodes(
      multipleLinkedList,
      combinedFlowId,
    );

    return multipleLinkedList;
  }

  async deleteWorkflowNodes(id: string, permanent: boolean) {
    return await this.repository.delWorkflowNodes(id, permanent);
  }

  async modifyWorkflowNodes(
    combinedFlowId: string,
    nodes?: BuilderInputNode[],
    edges?: BuilderInputEdge[],
  ) {
    if (!nodes || !edges) return;

    const multipleLinkedList =
      this.workflowMultipleLinkedListFactory.buildByBuilder(
        nodes,
        edges,
        combinedFlowId,
      );

    await this.repository.upsertWorkflowNodes(
      multipleLinkedList,
      combinedFlowId,
      true,
    );
  }

  async duplicateCombinedFlowNodes(
    newCombinedFlowId: string,
    oldCombinedFlowId: string,
  ) {
    const nodeIdMapping = new Map<string, string>();
    const transaction: any = [];
    const nodes = await this.prisma.workflowNode.findMany({
      where: {
        combinedFlowId: oldCombinedFlowId,
      },
    });

    const workflowNodes: WorkflowMultipleLinkedNode[] = [];

    nodes.forEach((node) => {
      const randomId = nanoid();
      nodeIdMapping.set(node.id, randomId);
      node.id = randomId;
      node.combinedFlowId = newCombinedFlowId;
      workflowNodes.push(
        new WorkflowMultipleLinkedNode({ ...node, outputs: [], inputs: [] }),
      );
    });

    workflowNodes.forEach((node) => {
      if (node.nextId) {
        node.nextId = nodeIdMapping.get(node.nextId);
      }
      if (node.parentId) {
        node.parentId = nodeIdMapping.get(node.parentId);
      }
    });

    const multipleLinkedList =
      ConvertUtils.nodesConvertToMultipleLinkedList(workflowNodes);

    multipleLinkedList?.toPrismaCreateInputs().map(async (item) => {
      const { inputs, outputs, ...data } = item;
      transaction.push(
        this.prisma.workflowNode.create({
          data: {
            ...data,
          },
        }),
      );
    });

    await this.prisma.$transaction(transaction);

    return nodeIdMapping;
  }
}
