import { WorkflowNodeType } from '../../enums/workflowNode.enum';
import { ConvertUtils } from '../utils/convert.utils';
import { WorkflowNodeUtils } from '../utils/workflowNode.utils';
import { WorkflowMultipleLinkedNode } from './workflow-multiple-linked-node.model';

// 流程的多重链表结构 Workflow multiple linked list
export class WorkflowMultipleLinkedList {
  /**
   * 构造函数
   * @param {WorkflowMultipleLinkedNode} value - 当前节点的值
   * @param {WorkflowMultipleLinkedList[]} [children] - 子链表
   * @param {WorkflowMultipleLinkedList} next - 下一个节点
   */
  constructor(
    value: WorkflowMultipleLinkedNode,
    children?: WorkflowMultipleLinkedList[],
    next?: WorkflowMultipleLinkedList,
  ) {
    this._value = value;
    this._children = children || [];
    this._next = next || undefined;
  }

  protected _value: WorkflowMultipleLinkedNode;

  get value(): WorkflowMultipleLinkedNode {
    return this._value;
  }

  protected _children: WorkflowMultipleLinkedList[];

  get children(): WorkflowMultipleLinkedList[] {
    return this._children;
  }

  protected _next?: WorkflowMultipleLinkedList;

  get next(): WorkflowMultipleLinkedList | undefined {
    return this._next;
  }

  set next(node: WorkflowMultipleLinkedList | undefined) {
    this._next = node;
  }

  toPrismaCreateInputs() {
    return ConvertUtils.multipleLinkedListConvertToPrismaCreateInputs(this);
  }

  toCombinedFlowBuilder() {
    return ConvertUtils.multipleLinkedListConvertToBuilder(this);
  }

  toCombinedFlowExecList(): WorkflowMultipleLinkedNode[] {
    return ConvertUtils.multipleLinkedListConvertToExecList(this);
  }

  /**
   * 根据priority，将节点插入到子链中
   * @param childrenNode
   */
  insertChildrenByPriority(childrenNode: WorkflowMultipleLinkedList) {
    WorkflowNodeUtils.insertByPriority(childrenNode, this.children);
  }

  /**
   * 将多重链表结构转换打平为数组，忽略AlternativeFlow节点
   */
  flatten(
    isIgnoreAlternativeFlow: boolean = false,
  ): WorkflowMultipleLinkedNode[] {
    const result: WorkflowMultipleLinkedNode[] = [];

    function traverse(node: WorkflowMultipleLinkedList) {
      const { children, next, value } = node;

      if (
        value.type !== WorkflowNodeType.AlternativeFlow &&
        !isIgnoreAlternativeFlow
      )
        result.push(value);

      // 递归处理子节点和兄弟节点
      children?.forEach((child) => traverse(child));

      next && traverse(next);
    }

    traverse(this);

    return result;
  }

  /**
   * 在尾部插入节点
   */
  append(node: WorkflowMultipleLinkedList) {
    const lastNode = this.getLastNode();

    lastNode.next = node;
  }

  /**
   * 获取最后一个节点
   */
  getLastNode(): WorkflowMultipleLinkedList {
    let currentNode: WorkflowMultipleLinkedList = this;

    while (currentNode.next) {
      currentNode = currentNode.next;
    }

    return currentNode;
  }
}
