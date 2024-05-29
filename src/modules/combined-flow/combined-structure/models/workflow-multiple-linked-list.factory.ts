import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../../enums/workflowNode.enum';
import {
  BuilderInputEdge,
  BuilderInputNode,
} from '../../types/combinedFlow.dto';
import { CombinedStructureRepository } from '../combined-structure.repository';
import { ConvertUtils } from '../utils/convert.utils';
import { WorkflowMultipleLinkedList } from './workflow-multiple-linked-list.model';
import { WorkflowMultipleLinkedNode } from './workflow-multiple-linked-node.model';
import { CombinedFlowParamRepository } from '../../combined-flow-param/combined-flow-param.repository';
import { PrismaService } from 'src/core/services/prisma';

export class WorkflowMultipleLinkedListFactory {
  constructor(
    private combinedStructureRepository: CombinedStructureRepository,
    private workflowParamsRepository: WorkflowParamsRepository,
    private combinedFlowParamRepository: CombinedFlowParamRepository,
    private readonly prisma: PrismaService,
  ) {}

  async buildByWorkflowId(
    id: string,
    options?: WorkflowMultipleLinkedListFactoryOptions,
    paramIdMapping?: Map<string, string>,
  ): Promise<WorkflowMultipleLinkedList | null> {
    let nodes =
      await this.combinedStructureRepository.getWorkflowMultipleLinkedNodesByCombinedFlowId(
        id,
        options,
        paramIdMapping,
      );

    if (options?.isCompatibleAtomFlow && !nodes.length) {
      nodes = [await this.generateNodeByAtomFlow(id, options, paramIdMapping)];
    }

    const rst = ConvertUtils.nodesConvertToMultipleLinkedList(nodes);
    return rst;
  }

  /**
   * 根据原子流程or组合流程的ID数组创建组合流程多重链表（不包含数据流转相关信息）
   * @param ids
   * @returns
   */
  async buildByIds(ids: string[]): Promise<WorkflowMultipleLinkedList> {
    const listArr: WorkflowMultipleLinkedList[] = [];

    for (const id of ids) {
      const list = await this.buildByWorkflowId(id, {
        isRandomId: true,
        isCompatibleAtomFlow: true,
      });

      list && listArr.push(list);
    }

    const workflowMultipleLinkedList = listArr.shift()!;
    listArr.map((item) => {
      workflowMultipleLinkedList.append(item);
    });

    return workflowMultipleLinkedList;
  }

  buildByBuilder(
    nodes: BuilderInputNode[],
    edges: BuilderInputEdge[],
    combinedFlowId: string,
  ): WorkflowMultipleLinkedList {
    return ConvertUtils.builderConvertToMultipleLinkedList(
      nodes,
      edges,
      combinedFlowId,
    );
  }

  /**
   * 获取多重链表节点，兼容原子流程
   * @param id
   * @returns
   */
  async buildNodeById(id: string): Promise<WorkflowMultipleLinkedNode> {
    const node = await this.prisma.workflowNode.findUnique({
      where: {
        id,
      },
      include: {
        atomFlow: true,
        component: true,
      },
    });

    const { inputs, outputs } =
      await this.combinedFlowParamRepository.getWorkflowNodeParamsByNodeId(id);

    const workflowNode = node
      ? new WorkflowMultipleLinkedNode({ ...node, inputs, outputs })
      : null;

    if (workflowNode) return workflowNode;

    return await this.generateNodeByAtomFlow(id);
  }

  private async generateNodeByAtomFlow(
    id: string,
    options?: WorkflowMultipleLinkedListFactoryOptions,
    paramIdMapping?: Map<string, string>,
  ) {
    const node = new WorkflowMultipleLinkedNode({
      id,
      combinedFlowId: id,
      type: WorkflowNodeType.AtomFlow,
      atomFlowId: id,
      atomFlow: await this.prisma.recording.findUnique({ where: { id } }),
      inputs: [],
      outputs: (await this.workflowParamsRepository.getParams(id)).map(
        (item) => ({
          id,
          paramId: item.id,
          originName: item.name,
          value: [],
        }),
      ),
    });

    if (options?.isRandomId) {
      node.id = nanoid();
      if (paramIdMapping) {
        node.outputs.forEach((output) => {
          output.id = nanoid();
          output.paramId = paramIdMapping.get(output.paramId)!;
        });
      }
    }

    return node;
  }
}

export interface WorkflowMultipleLinkedListFactoryOptions {
  /**
   * 是否采用随机ID
   */
  isRandomId?: boolean | undefined;
  /**
   * 是否包含实体信息
   */
  withEntity?: boolean | undefined;
  /**
   * 是否兼容原子流程
   */
  isCompatibleAtomFlow?: boolean | undefined;
}
