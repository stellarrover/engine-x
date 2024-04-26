import {
  MultipleLinkedList,
  MultipleLinkedListNode,
  MultipleLinkedValue,
} from '@multiple-linked-list';
import { $Enums, Prisma } from '@prisma/client';

export class XMuLinList extends MultipleLinkedList<
  XMuLinListValue,
  XMuLinListNode
> {
  toExecList(): XMuLinListValue[] {
    return this.root.toExecList();
  }
}

export class XMuLinListNode extends MultipleLinkedListNode<
  XMuLinListValue,
  XMuLinListNode
> {
  /**
   * @param {T} value - 当前节点的值
   * @param {XMuLinListNode[]} [children] - 子链表
   * @param {XMuLinListNode} next - 下一个节点
   */
  constructor(
    value: XMuLinListValue,
    children?: XMuLinListNode[],
    next?: XMuLinListNode,
  ) {
    super(value, children, next);
  }

  toExecList(): XMuLinListValue[] {
    const execList: XMuLinListValue[] = [];

    function traverse(node: XMuLinListNode) {
      const { children, next, value } = node;

      if (children.length) traverse(children[0]);

      execList.push(value);

      next && traverse(next);
    }

    traverse(this);

    return execList;
  }
}

export class XMuLinListValue
  extends MultipleLinkedValue
  implements Prisma.WorkflowNodeCreateInput
{
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deleted?: boolean;
  deletedAt?: string | Date;
  lastEditorId?: string;
  type: $Enums.WorkflowNodeType;
  optional?: boolean;
  prompt?: string;
  creator?: Prisma.UserCreateNestedOneWithoutWorkflowNodesInput;
  parentNode?: Prisma.WorkflowNodeCreateNestedOneWithoutSubNodesInput;
  subNodes?: Prisma.WorkflowNodeCreateNestedManyWithoutParentNodeInput;
  nextNode?: Prisma.WorkflowNodeCreateNestedOneWithoutPreviousNodeInput;
  previousNode?: Prisma.WorkflowNodeCreateNestedOneWithoutNextNodeInput;
  root: Prisma.WorkflowCreateNestedOneWithoutSubFlowsInput;
  component?: Prisma.ComponentCreateNestedOneWithoutUsingNodesInput;
  params?: Prisma.WorkflowNodeParamCreateNestedManyWithoutNodeInput;
}
