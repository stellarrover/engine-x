import { ArrayMinSize } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import { Field, InputType, ObjectType } from 'type-graphql';
import i18n from '../../../i18n';
import { CreateWorkflowInput, ModifyWorkflowInput, Workflow } from '../../workflow/types/workflow.dto';
import { Component } from '../components/types/component.dto';
import { WorkflowNodeType } from '../enums/workflowNode.enum';
import { WorkflowParamType } from '../enums/workflowParam.enum';

@InputType({ description: '组合流程创建模型' })
export class CreateCombinedFlowInput extends CreateWorkflowInput {
  @Field(() => [String], { nullable: false, description: '需要被合并到经验id的数组' })
  @ArrayMinSize(1, { message: i18n().resolver.arrayCannotBeEmpty('combineWorkflowIds') })
  combineWorkflowIds!: string[];
}

@InputType({ description: '组合流程修改模型' })
export class ModifyCombinedFlowInput extends ModifyWorkflowInput {
  @Field(() => [BuilderInputNode], { nullable: true })
  @ArrayMinSize(0, { message: i18n().resolver.arrayCannotBeEmpty('builderNodes') })
  nodes!: BuilderInputNode[];
  @Field(() => [BuilderInputEdge], { nullable: true })
  edges?: BuilderInputEdge[];
}

@InputType()
export class BuilderInputNode {
  @Field(() => String)
  id!: string;
  @Field(() => String, { nullable: true })
  parentId?: string | null;
  @Field(() => WorkflowNodeType)
  type!: string;
  @Field(() => Boolean, { nullable: true })
  optional?: boolean;
  @Field(() => String, { nullable: true })
  atomFlowId?: string | null;
  @Field(() => String, { nullable: true })
  componentId?: string | null;
  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: any;
  @Field(() => [WorkflowInputToBackend], { nullable: true })
  inputs!: WorkflowInputToBackend[];
  @Field(() => [WorkflowOutputToBackend], { nullable: true })
  outputs!: WorkflowOutputToBackend[];
  @Field(() => String, { nullable: true })
  prompt?: string;
}

@InputType()
export class BuilderInputEdge {
  @Field(() => String)
  id!: string;
  @Field(() => String)
  source!: string;
  @Field(() => String)
  target!: string;
}

@ObjectType()
export class CombinedFlowBuilder {
  @Field(() => [BuilderOutputNode])
  nodes!: BuilderOutputNode[];
  @Field(() => [BuilderOutputEdge])
  edges!: BuilderOutputEdge[];
  @Field(() => [CombinedFlowParamOutput])
  parameterList!: CombinedFlowParamOutput[];
}

@ObjectType({ description: '[画布版本]组合流程模型-Node' })
export class BuilderOutputNode {
  @Field(() => String)
  id!: string;
  @Field(() => String, { nullable: true })
  parentNode?: string | null;
  @Field(() => WorkflowNodeType)
  type!: string;
  @Field(() => Boolean, { nullable: true })
  optional?: boolean;
  @Field(() => Workflow, { nullable: true })
  atomFlow?: Workflow | null;
  @Field(() => Component, { nullable: true })
  component?: Component | null;
  @Field(() => GraphQLJSON, { nullable: true })
  metadata: any;
  @Field(() => [WorkflowInput], { nullable: true })
  inputs?: WorkflowInput[];
  @Field(() => [WorkflowOutput], { nullable: true })
  outputs?: WorkflowOutput[];
  @Field(() => String, { nullable: true })
  prompt?: string | null;
}

@ObjectType({ description: '[画布版本]组合流程模型-Edge' })
export class BuilderOutputEdge {
  @Field(() => String)
  id!: string;
  @Field(() => String)
  source!: string;
  @Field(() => String)
  target!: string;
}

@ObjectType({ description: '组合流程执行节点模型' })
export class CombinedFlowExec {
  @Field(() => String, { description: '页面渲染唯一标识' })
  uuid!: string;
  @Field(() => String, { description: '流程名称' })
  title!: string;
  @Field(() => String, { description: '当前执行节点' })
  currentId!: string;
  @Field(() => String, { description: '父节点(alternative)', nullable: true })
  parentId?: string | null;
  @Field(() => String, { description: '下一个执行节点', nullable: true })
  nextId?: string | null;
  @Field(() => Boolean, { description: '是否为可选结点', nullable: true })
  optional?: boolean;
  @Field(() => WorkflowNodeType, { description: '流程类型' })
  type!: string;
}

@InputType()
export class WorkflowInputToBackend {
  @Field(() => String)
  id!: string;
  @Field(() => String, { nullable: true })
  usingPromptLabel?: string | null;
  @Field(() => String)
  paramId!: string;
}

@ObjectType()
export class WorkflowInput {
  @Field(() => String)
  id!: string;
  @Field(() => String, { nullable: true })
  usingPromptLabel?: string | null;
  @Field(() => String)
  paramId!: string;
}

@InputType()
export class WorkflowOutputToBackend {
  @Field(() => String)
  id!: string;
  @Field(() => String)
  paramId!: string;
}

@ObjectType()
export class WorkflowOutput {
  @Field(() => String)
  id!: string;
  @Field(() => String)
  paramId!: string;
}

@InputType()
export class CombinedFlowParamInput {
  @Field(() => String)
  id!: string;
  @Field(() => String, { nullable: true })
  name?: string | null;
  @Field(() => WorkflowParamType)
  type!: string;
  @Field(() => String, { nullable: true })
  subType?: string | null;
  @Field(() => String)
  originName!: string;
  @Field(() => String, { nullable: true })
  atomFlowOutputId?: string | null;
  @Field(() => String, { nullable: true })
  componentOutputId?: string | null;
}

@ObjectType()
export class CombinedFlowParamOutput {
  @Field(() => String)
  id!: string;
  @Field(() => String, { nullable: true })
  name?: string | null;
  @Field(() => WorkflowParamType)
  type!: string;
  @Field(() => String, { nullable: true })
  subType?: string | null;
  @Field(() => String)
  originName!: string;
  @Field(() => String, { nullable: true })
  atomFlowOutputId?: string | null;
  @Field(() => String, { nullable: true })
  componentOutputId?: string | null;
}
