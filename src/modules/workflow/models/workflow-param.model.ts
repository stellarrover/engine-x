import { $Enums, Prisma } from '@prisma/client';

export class WorkflowParam implements Prisma.WorkflowParamCreateInput {
  id: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  name?: string;
  root: Prisma.WorkflowCreateNestedOneWithoutParamsInput;
  componentOutput?: Prisma.ComponentOutputCreateNestedOneWithoutUsingParamsInput;
  usingNode?: Prisma.WorkflowNodeParamCreateNestedManyWithoutParamInput;
}

export class WorkflowNodeParam implements Prisma.WorkflowNodeParamCreateInput {
  id: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  usingPromptLabel?: string;
  type: $Enums.WorkflowNodeParamYype;
  node: Prisma.WorkflowNodeCreateNestedOneWithoutParamsInput;
  param?: Prisma.WorkflowParamCreateNestedOneWithoutUsingNodeInput;
}

export class WorkflowNodeInput extends WorkflowNodeParam {
  usingPromptLabel: string;
}

export class WorkflowNodeOutput extends WorkflowNodeParam {
  value?: string;
}
