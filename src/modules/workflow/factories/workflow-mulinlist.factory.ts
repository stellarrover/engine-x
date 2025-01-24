import { Injectable } from '@nestjs/common';
import { WorkflowNodeParamYype } from '@prisma/client';
import { PrismaService } from 'src/core/services/prisma';
import { XMuLinList, XMuLinListNode, XMuLinListValue } from '../models/workflow-mulinlist.model';

@Injectable()
export class WorkflowMuLinListFactory {
  constructor(private readonly prisma: PrismaService) {}

  async build(workflowId: string): Promise<XMuLinList> {
    const root = new XMuLinList();
    const nodeMap = new Map<string, XMuLinListNode>();

    const workflowNodes = await this.prisma.workflowNode.findMany({
      where: {
        rootId: workflowId,
      },
      include: {
        component: true,
        params: true,
        previousNode: true,
      },
    });

    workflowNodes.forEach((item) => {
      const { params, ...data } = item;
      const muLinListNode = new XMuLinListNode(
        new XMuLinListValue({
          ...data,
          inputs: params.filter((item) => item.type === WorkflowNodeParamYype.Input),
          outputs: params.filter((item) => item.type === WorkflowNodeParamYype.Output),
        }),
      );
      nodeMap.set(item.id, muLinListNode);

      if (!item.parentId && !item.previousNode) {
        root.root = muLinListNode;
      }
    });

    for (const iterator of workflowNodes) {
      // In this context, it is guaranteed to be obtainable.
      const muLinListNode = nodeMap.get(iterator.id);

      if (!muLinListNode) continue;

      if (iterator.previousNode?.id) {
        const previousNode = nodeMap.get(iterator.previousNode.id);
        previousNode && previousNode.append(muLinListNode);
      }

      if (iterator.parentId) {
        const parentNode = nodeMap.get(iterator.parentId);
        parentNode && parentNode.insertChildrenByPriority(muLinListNode);
      }
    }

    return root;
  }
}
