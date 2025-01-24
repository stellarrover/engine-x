import { MultipleLinkedList, MultipleLinkedListNode, MultipleLinkedValue } from '@multiple-linked-list';
import { $Enums, Component, WorkflowNode } from '@prisma/client';
import { OmitType } from 'src/common/types/omit.type';
import { WorkflowNodeInput, WorkflowNodeOutput } from './workflow-param.model';

export class XMuLinList extends MultipleLinkedList<XMuLinListValue, XMuLinListNode> {
  toExecList(): XMuLinListValue[] {
    return this.root.toExecList();
  }
}

export class XMuLinListNode extends MultipleLinkedListNode<XMuLinListValue, XMuLinListNode> {
  /**
   * @param {T} value - 当前节点的值
   * @param {XMuLinListNode[]} [children] - 子链表
   * @param {XMuLinListNode} next - 下一个节点
   */
  constructor(value: XMuLinListValue, children?: XMuLinListNode[], next?: XMuLinListNode) {
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
  implements Omit<WorkflowNode, OmitType | 'rootId' | 'componentId'>
{
  type: $Enums.WorkflowNodeType;
  optional: boolean;
  prompt: string | null;
  component?: Component | null;
  inputs: WorkflowNodeInput[];
  outputs: WorkflowNodeOutput[];

  constructor(
    init: WorkflowNode & {
      inputs: WorkflowNodeInput[];
      outputs: WorkflowNodeOutput[];
      component?: Component | null;
    },
  ) {
    super(init);
    this.type = init.type;
    this.optional = init.optional;
    this.prompt = init.prompt;
    this.component = init.component;
    this.inputs = init.inputs;
    this.outputs = init.outputs;
  }
}
