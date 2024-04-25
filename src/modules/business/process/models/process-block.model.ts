import { Component } from '@prisma/client';
import {
  WorkflowNodeInput,
  WorkflowNodeOutput,
} from '../../workflow/models/workflow-param.model';
import { Process } from '../types/process.type';

export class ProcessBlockModel {
  constructor() {
    this._status = ProcessBlockStatus.Unhandled;
  }

  /**
   * 流程执行块唯一标识
   */
  private _blockId: string;
  get blockId(): string {
    return this._blockId;
  }

  private _curNode: {
    nodeId: string;
    parentId?: string;
    nextId?: string;
    optional?: boolean;
    prompt?: string;
    inputs: WorkflowNodeInput[];
    outputs: WorkflowNodeOutput[];
  };

  private _component: Component;
  get component(): Component {
    return this.component;
  }

  private process: Process;

  /**
   * 执行状态
   */
  private _status: ProcessBlockStatus;
  get status(): ProcessBlockStatus {
    return this._status;
  }

  toPending(): boolean {
    if (this._status >= ProcessBlockStatus.Processing) return false;
    this._status = ProcessBlockStatus.Processing;
    return true;
  }

  toGenerated() {
    if (this._status !== ProcessBlockStatus.Processing) return false;
    this._status = ProcessBlockStatus.Generated;
    return true;
  }

  toRejected() {
    if (this._status !== ProcessBlockStatus.Processing) return false;
    this._status = ProcessBlockStatus.Rejected;
    return true;
  }

  toExecuted() {
    if (this._status < ProcessBlockStatus.Generated) return false;
    this._status = ProcessBlockStatus.Executed;
    return true;
  }

  toFailed() {
    if (this._status < ProcessBlockStatus.Generated) return false;
    this._status = ProcessBlockStatus.Failed;
    return true;
  }
}

/**
 * 流程执行状态
 */
export enum ProcessBlockStatus {
  /**
   * 已创建，但尚未注册任何处理程序
   */
  Unhandled = 1,
  /**
   * 已注册处理程序，正在处理中
   */
  Processing,
  /**
   * 处理完成
   */
  Generated,
  /**
   * 正在执行
   */
  Executing,
  /**
   * 已执行完成
   */
  Executed = 5,
  /**
   * 处理失败
   */
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  Rejected = 0,
  /**
   * 执行失败
   */
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  Failed = 0,
}
