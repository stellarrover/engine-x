import { MultipleLinkedListNode } from './node';
import { MultipleLinkedValue } from './value';

export class MultipleLinkedList<
  T extends MultipleLinkedValue = MultipleLinkedValue,
> {
  constructor(root: MultipleLinkedListNode<T>) {
    this._root = root;
  }

  protected _root: MultipleLinkedListNode<T>;
  get root(): MultipleLinkedListNode<T> {
    return this._root;
  }

  flatten(): T[] {
    return this._root.flatten();
  }

  append(node: MultipleLinkedListNode<T> | MultipleLinkedList<T>): void {
    this._root.append(node instanceof MultipleLinkedList ? node.root : node);
  }
}
