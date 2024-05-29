import { registerEnumType } from 'type-graphql';

export enum ComponentType {
  LLM = 'LLM',
  Print = 'Print',
  Loop = 'Loop',
  GoTo = 'GoTo',
  If = 'If',
  ChinaUnicomA = 'ChinaUnicomA',
  ChinaUnicomB = 'ChinaUnicomB',
  ChinaUnicomC = 'ChinaUnicomC',
}

registerEnumType(ComponentType, {
  name: 'ComponentType',
  description: '组件类型',
  valuesConfig: {},
});
