import { WorkflowMultipleLinkedList } from '../models/workflowMultipleLinkedList.model';
import { WorkflowMultipleLinkedNode } from '../models/workflowMultipleLinkedNode.model';

export const WorkflowNodeUtils = {
  insertByPriority(item: WorkflowMultipleLinkedList, array: WorkflowMultipleLinkedList[]) {
    const priority = item.value.priority;

    if (!priority) {
      item.value.priority = array.length + 1;
      array.push(item);
      return;
    }

    let index = 0;

    // 找到合适的插入位置
    for (let i = 0; i < array.length; i++) {
      if ((array[i].value.priority ?? 0) <= priority) {
        index = i + 1;
      }
    }

    // 插入元素到数组
    array.splice(index, 0, item);
  },
  /**
   * 根据parentId获取指定节点的子链数组
   * @param parentId
   */
  getChildrenById(parentId: string, list: WorkflowMultipleLinkedList): WorkflowMultipleLinkedList[] {
    let result: WorkflowMultipleLinkedList[] = [];

    function traverse(node: WorkflowMultipleLinkedList) {
      const { children, next, value } = node;

      if (value.id === parentId) {
        result = children;
        return;
      }

      // 递归处理子节点和兄弟节点
      children?.forEach((child) => traverse(child));

      next && traverse(next);
    }

    traverse(list);

    return result;
  },
  /**
   * 根据节点id获取当前节点所在的子链表
   * @param nodeId
   * @param children
   */
  getCurrentLinkedList(nodeId: string, children: WorkflowMultipleLinkedList[]): WorkflowMultipleLinkedList | undefined {
    let currentLinkedList: WorkflowMultipleLinkedList | undefined;

    function traverse(node: WorkflowMultipleLinkedList): boolean {
      const { next, value } = node;

      if (value.id === nodeId) return true;

      if (next) return traverse(next);

      return false;
    }

    for (const child of children) {
      if (traverse(child)) {
        currentLinkedList = child;
        break;
      }
    }

    return currentLinkedList;
  },
  /**
   * 循环链表
   * @param linkedList
   * @returns
   */
  multiplyLinkedList(linkedList: WorkflowMultipleLinkedList, loopsNum: number): WorkflowMultipleLinkedList {
    const rst: WorkflowMultipleLinkedList = this.duplicateLinkedList(linkedList);
    let head = rst;

    for (let i = 1; i < loopsNum; i++) {
      // 注意这里i=1，初始就已经是一次了
      while (head.next) {
        head = head.next;
      }
      head.next = this.duplicateLinkedList(linkedList);
    }
    return rst;
  },
  /**
   * 复制链表
   * @param linkedList
   * @returns
   */
  duplicateLinkedList(linkedList: WorkflowMultipleLinkedList): WorkflowMultipleLinkedList {
    let head = linkedList;

    let rst = new WorkflowMultipleLinkedList(new WorkflowMultipleLinkedNode(head.value), head.children);
    let point = rst;
    while (head.next) {
      head = head.next;
      const curNode = new WorkflowMultipleLinkedNode(head.value);
      point.next = new WorkflowMultipleLinkedList(curNode, head.children);
      point = point.next;
    }
    return rst;
  },
  /**
   * 根据节点id获取以此节点为头的子链表
   * @param nodeId
   * @param children
   * @returns
   */
  getSubLinkedList(
    nodeId: string,
    multipleLinkedList: WorkflowMultipleLinkedList
  ): WorkflowMultipleLinkedList | undefined {
    let result: WorkflowMultipleLinkedList | undefined;

    function traverse(node: WorkflowMultipleLinkedList) {
      const { next, value, children } = node;

      if (value.id === nodeId) {
        result = node;
        return;
      }

      children?.forEach((child) => {
        traverse(child);
      });

      if (next) traverse(next);
    }
    traverse(multipleLinkedList);

    return result;
  },
};
