import { Prisma } from '@prisma/client';
import _ from 'lodash';
import { nanoid } from 'nanoid';
import { ComponentType } from '../../enums/component.enum';
import { WorkflowNodeType } from '../../enums/workflowNode.enum';
import { BuilderInputEdge, BuilderInputNode, BuilderOutputEdge, BuilderOutputNode } from '../../types/combinedFlow.dto';
import { WorkflowMultipleLinkedList } from '../models/workflowMultipleLinkedList.model';
import { WorkflowMultipleLinkedNode } from '../models/workflowMultipleLinkedNode.model';

export const ConvertUtils = {
  /**
   * 将ID数组转换为多重链表结构
   * 时间复杂度是O(n)，其中n是数组的长度
   * @param ids
   * @param combinedFlowId
   * @returns
   */
  idsConvertToMultipleLinkedList(ids: string[], combinedFlowId: string): WorkflowMultipleLinkedList {
    if (!ids.length) throw new Error('Wrong ids!');

    const idMapping = new Map<string, string>();
    ids = _.clone(ids);
    ids.forEach((id) => idMapping.set(id, nanoid()));

    const nodeValue = new WorkflowMultipleLinkedNode({
      id: nanoid(),
      atomFlowId: ids.shift()!,
      combinedFlowId,
      type: WorkflowNodeType.AtomFlow,
      inputs: [],
      outputs: [],
    });
    const head = new WorkflowMultipleLinkedList(nodeValue);
    let current = head;

    for (const id of ids) {
      const nodeValue = new WorkflowMultipleLinkedNode({
        id: nanoid(),
        atomFlowId: id,
        combinedFlowId,
        type: WorkflowNodeType.AtomFlow,
        inputs: [],
        outputs: [],
      });
      const node = new WorkflowMultipleLinkedList(nodeValue);
      current.next = node;
      current = node;
    }

    return head;
  },
  /**
   * 将构建数据转换为多重链表结构
   * 基于图的基本操作和遍历，时间复杂度是O(n + m)，其中n是节点的数量，m是边的数量
   * @param nodes
   * @param edges
   * @param combinedFlowId
   * @returns
   */
  builderConvertToMultipleLinkedList(
    nodes: BuilderInputNode[],
    edges: BuilderInputEdge[],
    combinedFlowId: string
  ): WorkflowMultipleLinkedList {
    const nodeMap: Map<string, WorkflowMultipleLinkedList> = new Map();
    const edgeMap: Map<string, string> = new Map();
    const reverseEdgeMap: Map<string, string> = new Map();

    // 将If节点和其子节点的连线去掉
    const ifNodes = nodes.filter((node) => node.type === WorkflowNodeType.If);
    edges = edges.filter((edge) => !ifNodes.some((node) => node.id === edge.source));

    edges.forEach((edge) => {
      edgeMap.set(edge.source, edge.target);
      reverseEdgeMap.set(edge.target, edge.source);
    });

    nodes.forEach((node) => {
      const workflowNode = new WorkflowMultipleLinkedNode({
        combinedFlowId,
        nextId: edgeMap.get(node.id),
        ...node,
      });

      // ⬇️ 创建以workflowNode为首的子链表
      const listNode = new WorkflowMultipleLinkedList(workflowNode);

      nodeMap.set(node.id, listNode);
    });

    let head: WorkflowMultipleLinkedList | undefined = undefined;

    nodes.forEach((node) => {
      const currentNode = nodeMap.get(node.id)!;
      const parentId = node.parentId;
      const nextId = edgeMap.get(node.id);

      if (parentId && !reverseEdgeMap.get(node.id)) {
        const parentNode = nodeMap.get(parentId);
        if (parentNode) {
          parentNode.insertChildrenByPriority(currentNode);
        }
      }

      if (nextId) {
        const nextNode = nodeMap.get(nextId);
        nextNode && (currentNode.next = nextNode);
      }

      if (!head) head = currentNode;
    });

    return head!;
  },
  /**
   * 将多重链表节点数组转换为多重链表结构
   * 时间复杂度是O(n)，其中n是节点的数量
   * @param nodes
   * @returns
   */
  nodesConvertToMultipleLinkedList(nodes: WorkflowMultipleLinkedNode[]): WorkflowMultipleLinkedList | null {
    const nodeMap: Map<string, WorkflowMultipleLinkedList> = new Map();
    const visitedNodes = new Set<string>();
    let head: WorkflowMultipleLinkedList | null = null;

    // 将所有节点转换为多重链表并存入map
    nodes.forEach((node) => {
      const listNode = new WorkflowMultipleLinkedList(node);
      nodeMap.set(node.id, listNode);
    });

    // 遍历所有节点，将节点的nextId和parentId转换为多重链表的next和children
    nodes.forEach((node) => {
      const currentNode = nodeMap.get(node.id)!;

      if (node.parentId && node.priority) {
        const parentNode = nodeMap.get(node.parentId);
        parentNode && parentNode.insertChildrenByPriority(currentNode);
      }

      if (node.nextId) {
        const nextNode = nodeMap.get(node.nextId);
        nextNode && (currentNode.next = nextNode);
      }
    });

    // 遍历所有节点，寻找头节点

    for (const node of nodes) {
      let currentNode = nodeMap.get(node.id);

      if (currentNode?.value.parentId) {
        visitedNodes.add(node.id);
        continue;
      }

      while (currentNode) {
        if (visitedNodes.has(currentNode.value.id)) {
          break;
        }

        if (node.id !== currentNode.value.id) {
          visitedNodes.add(currentNode.value.id);
        }

        currentNode = currentNode.next;
      }

      if ((currentNode && node.id !== currentNode.value.id) || !head) {
        visitedNodes.add(node.id);
        head = nodeMap.get(node.id)!;
      }
    }

    return head;
  },
  /**
   * 将多重链表结构转换为 prisma create inputs
   * 采用深度优先策略遍历多重链表，时间复杂度是O(n)，其中n是链表中节点的数量。
   * @param workflowMultiLink
   * @returns 以依赖倒叙的方式返回
   */
  multipleLinkedListConvertToPrismaCreateInputs(workflowMultiLink: WorkflowMultipleLinkedList) {
    const inputList: (Prisma.WorkflowNodeCreateManyInput & { inputs: Prisma.WorkflowNodeInputCreateManyInput[] } & {
      outputs: Prisma.WorkflowNodeOutputCreateManyInput[];
    })[] = [];

    function traverse(node: WorkflowMultipleLinkedList) {
      const { children, next, value } = node;

      const {
        id,
        type,
        priority,
        metadata,
        optional,
        parentId,
        atomFlowId,
        componentId,
        combinedFlowId,
        inputs,
        outputs,
        prompt,
      } = value;

      const inputItem = {
        id,
        type,
        priority,
        metadata: metadata ?? undefined,
        optional,
        parentId,
        atomFlowId,
        componentId,
        nextId: next?.value.id,
        combinedFlowId,
        prompt,
        inputs: inputs.map((input) => ({
          ...input,
          nodeId: id,
        })),
        outputs: outputs.map((output) => ({
          ...output,
          nodeId: id,
        })),
      };

      // 递归处理子节点和兄弟节点
      children?.forEach((child) => traverse(child));

      inputList.unshift(inputItem);

      next && traverse(next);
    }

    traverse(workflowMultiLink);

    return inputList;
  },
  /**
   * 将多重链表结构转换为 CombinedFlowBuilder
   * 采用深度优先策略遍历多重链表，时间复杂度是O(n)，其中n是链表中节点的数量。
   * @param workflowMultiLink
   * @returns
   */
  multipleLinkedListConvertToBuilder(workflowMultiLink: WorkflowMultipleLinkedList) {
    let nodes: BuilderOutputNode[] = [];
    let edges: BuilderOutputEdge[] = [];

    function traverse(workflowNode: WorkflowMultipleLinkedList) {
      const { children, next, value } = workflowNode;
      const { id, parentId, type, optional, atomFlow, component, metadata, prompt, inputs, outputs } = value;
      const node: BuilderOutputNode = {
        id,
        parentNode: parentId,
        type,
        optional,
        atomFlow,
        component,
        metadata,
        prompt,
        inputs,
        outputs,
      };
      nodes.push(node);

      next &&
        edges.push({
          id: nanoid(),
          source: id,
          target: next.value.id,
        });

      // 递归处理子节点和兄弟节点
      children?.forEach((child) => traverse(child));

      next && traverse(next);
    }

    traverse(workflowMultiLink);

    // 添加If节点和其子节点的连线
    const ifNodes = nodes.filter((node) => node.type === WorkflowNodeType.If);
    ifNodes.forEach((ifNode) => {
      const children = nodes.filter(
        (node) => node.parentNode === ifNode.id && edges.every((edge) => edge.target !== node.id)
      );
      children.forEach((child) => {
        edges.push({
          id: nanoid(),
          source: ifNode.id,
          target: child.id,
        });
      });
    });

    return { nodes, edges };
  },
  /**
   * 将多重链表结构的工作流转换为线性的执行列表
   * 采用深度优先策略遍历多重链表，时间复杂度是O(n)，其中n是链表中节点的数量。
   * @param workflowMultiLink
   * @returns
   */
  multipleLinkedListConvertToExecList(workflowMultiLink: WorkflowMultipleLinkedList): WorkflowMultipleLinkedNode[] {
    const execList: WorkflowMultipleLinkedNode[] = [];

    function traverse(node: WorkflowMultipleLinkedList) {
      const { children, next, value } = node;

      if (value.type == WorkflowNodeType.AlternativeFlow && children.length) traverse(children[0]);
      else if (value.type == WorkflowNodeType.Loop) {
        // 这一步就是这个loop;
        // TODO - 这里的逻辑有问题，应该是保存的时候此节点的componentId就绑定了loop组件的id，而不是在这里处理
        value.component = {
          title: 'Generate Flows',
          description: 'Replanning...',
          type: ComponentType.Loop,
          id: 'LOopN4FxiL88QbxJWM_v',
        };
      }

      if (value.type !== WorkflowNodeType.AlternativeFlow && value.type !== WorkflowNodeType.Empty)
        execList.push(value);

      next && traverse(next);
    }

    traverse(workflowMultiLink);

    return execList;
  },
};
