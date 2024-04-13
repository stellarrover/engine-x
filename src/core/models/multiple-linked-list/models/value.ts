export class MultipleLinkedValue {
  /**
   * @param init
   */
  constructor(init: {
    id: string;
    nextId?: string | null;
    parentId?: string | null;
    priority?: number | null;
    metadata?: any;
  }) {
    this._id = init.id;
    this._nextId = init.nextId;
    this._parentId = init.parentId;
    this._priority = init.priority;
    this._metadata = init.metadata;
  }

  protected _id!: string;
  get id(): string {
    return this._id;
  }

  /**
   * 下一个节点标识符
   */
  protected _nextId?: string | null | undefined;
  get nextId(): string | null | undefined {
    return this._nextId;
  }

  /**
   * 父节点标识符
   */
  protected _parentId?: string | null | undefined;
  get parentId(): string | null | undefined {
    return this._parentId;
  }

  /**
   * 子链表优先级，只在子链表头节点存储
   */
  protected _priority?: number | null | undefined;
  get priority(): number | null | undefined {
    return this._priority;
  }

  /**
   * 附加信息
   */
  protected _metadata?: any;
  get metadata(): any {
    return this._metadata;
  }

  setPriority(priority: number | null): void {
    this._priority = priority;
  }
}
