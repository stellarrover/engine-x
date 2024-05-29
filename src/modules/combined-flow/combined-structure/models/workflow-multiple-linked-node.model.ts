import { Component } from '@prisma/client';
import { WorkflowOutput } from '../../types/combinedFlow.dto';

// 流程节点类型
export class WorkflowMultipleLinkedNode {
  id!: string;

  /**
   * 下一个节点
   */
  nextId?: string | null;

  /**
   * 父节点标识符
   */
  parentId?: string | null;

  /**
   * 子链表优先级，只在子链表头节点存储
   */
  priority?: number | null;

  /**
   * 组合流程标识符
   */
  combinedFlowId!: string; // rootId

  /**
   * 附加信息
   */
  metadata?: any;

  /**
   * 是否可选
   */
  optional?: boolean;

  /**
   * 提示信息模板字符串, 用于tagging中的aiMatch, 默认为query
   */
  prompt?: string;

  /**
   * 数据流转入参, 用于tagging中的strongMatch
   */
  inputs: WorkflowInput[];

  /**
   * 数据流转出参, 用于runTimeCache的存储
   */
  outputs: WorkflowOutput[];

  /**
   * 节点类型
   */
  type!: string;
  atomFlowId?: string | null;
  atomFlow?: Workflow | null;
  componentId?: string | null;
  component?: Component | null;

  constructor(init?: {
    id: string;
    combinedFlowId: string;
    type: string;
    nextId?: string | null;
    parentId?: string | null;
    priority?: number | null;
    metadata?: any;
    optional?: boolean;
    atomFlowId?: string | null;
    atomFlow?: Workflow | null;
    componentId?: string | null;
    component?: Component | null;
    prompt?: string | null;
    inputs: WorkflowInput[];
    outputs: WorkflowOutput[];
  }) {
    Object.assign(this, init);
    this.inputs = init?.inputs ?? [];
    this.outputs = init?.outputs ?? [];
    this.optional = init?.optional || false;
  }

  getTitle(): string {
    return this.atomFlow?.title || this.component?.title || '';
  }
}
