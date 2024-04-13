import { MultipleLinkedValue } from './value';

export class MultipleLinkedListNode<
  T extends MultipleLinkedValue = MultipleLinkedValue,
> {
  /**
   * @param {T} value - 当前节点的值
   * @param {MultipleLinkedListNode<T>[]} [children] - 子链表
   * @param {MultipleLinkedListNode<T>} next - 下一个节点
   */
  constructor(
    value: T,
    children?: MultipleLinkedListNode<T>[],
    next?: MultipleLinkedListNode<T>,
  ) {
    this._value = value;
    this._children = children || [];
    this._next = next || undefined;
  }

  protected _value: T;
  get value(): T {
    return this._value;
  }

  protected _children: MultipleLinkedListNode<T>[];
  get children(): MultipleLinkedListNode<T>[] {
    return this._children;
  }

  protected _next?: MultipleLinkedListNode<T>;
  get next(): MultipleLinkedListNode<T> | undefined {
    return this._next;
  }

  /**
   * 根据priority，将节点插入到子链中
   * @param childrenNode
   */
  insertChildrenByPriority(childrenNode: MultipleLinkedListNode<T>): void {
    const priority = childrenNode.value.priority;

    if (!priority) {
      childrenNode.value.setPriority(this.children.length + 1);
      this.children.push(childrenNode);
      return;
    }

    let index = 0;

    // 找到合适的插入位置
    for (let i = 0; i < this.children.length; i++) {
      if ((this.children[i].value.priority ?? 0) <= priority) {
        index = i + 1;
      }
    }

    // 插入元素到数组
    this.children.splice(index, 0, childrenNode);
  }

  /**
   * 将多重链表结构转换打平为数组
   */
  flatten(): T[] {
    const result: T[] = [];

    function traverse(node: MultipleLinkedListNode<T>): void {
      const { children, next, value } = node;

      result.push(value);

      // 递归处理子节点和兄弟节点
      children?.forEach((child) => {
        traverse(child);
      });

      next && traverse(next);
    }

    traverse(this);

    return result;
  }

  /**
   * 在尾部插入节点
   */
  append(node: MultipleLinkedListNode): void {
    const lastNode = this.lastNode;

    lastNode._next = node;
  }

  /**
   * 获取最后一个节点
   */
  get lastNode(): MultipleLinkedListNode {
    function traverse(node: MultipleLinkedListNode): MultipleLinkedListNode {
      return node.next ? traverse(node.next) : node;
    }

    return traverse(this);
  }
}
