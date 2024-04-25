import { MultipleLinkedValue } from './value';

export abstract class MultipleLinkedListNode<
  T extends MultipleLinkedValue = MultipleLinkedValue,
  K extends MultipleLinkedListNode<T> = any,
> {
  /**
   * @param {T} value - 当前节点的值
   * @param {XMuLinListNode[]} [children] - 子链表
   * @param {XMuLinListNode} next - 下一个节点
   */
  constructor(value: T, children?: K[], next?: K) {
    this._value = value;
    this._children = children || [];
    this._next = next || undefined;
  }

  protected _value: T;
  get value(): T {
    return this._value;
  }

  protected _children: K[];
  get children(): K[] {
    return this._children;
  }

  protected _next?: K;
  get next(): K | undefined {
    return this._next;
  }

  /**
   * 根据priority，将节点插入到子链中
   * @param childrenNode
   */
  insertChildrenByPriority(childrenNode: K): void {
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

    function traverse(node): void {
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
  append(node: K): void {
    const lastNode = this.lastNode;

    lastNode._next = node;
  }

  /**
   * 获取最后一个节点
   */
  get lastNode(): K {
    function traverse(node) {
      return node.next ? traverse(node.next) : node;
    }

    return traverse(this);
  }
}
