import { registerEnumType } from 'type-graphql';

export enum WorkflowParamType {
  Query = 'Query',
  Prompt = 'Prompt',
  Cache = 'Cache',
  File = 'File',
  API = 'API',
  Knowledge = 'Knowledge',
  Thought = 'Thought',
  Message = 'Message',
  LLM = 'LLM',
  Print = 'Print',
  If = 'If',
  ChinaUnicom = 'ChinaUnicom',
}

registerEnumType(WorkflowParamType, {
  name: 'WorkflowParamType',
  description: '参数类型',
  valuesConfig: {},
});
