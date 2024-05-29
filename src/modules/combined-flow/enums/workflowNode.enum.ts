import { registerEnumType } from 'type-graphql';

export enum WorkflowNodeType {
  AtomFlow = 'AtomFlow',
  AlternativeFlow = 'AlternativeFlow',
  Component = 'Component',
  Loop = 'Loop',
  Empty = 'Empty',
  If = 'If',
  GoTo = 'GoTo',
}

registerEnumType(WorkflowNodeType, {
  name: 'WorkflowNodeType',
  description: '节点类型',
  valuesConfig: {},
});
