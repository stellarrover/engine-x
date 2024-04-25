import { MultipleLinkedListNode } from './node';
import { MultipleLinkedValue } from './value';

export abstract class MultipleLinkedList<
  T extends MultipleLinkedValue = MultipleLinkedValue,
  K extends MultipleLinkedListNode<T> = MultipleLinkedListNode<T>,
> {
  protected _root: K;
  get root(): K {
    return this._root;
  }

  flatten(): T[] {
    return this._root.flatten();
  }

  append(node: K | MultipleLinkedList<T, K>): void {
    this._root.append(node instanceof MultipleLinkedList ? node.root : node);
  }
}
