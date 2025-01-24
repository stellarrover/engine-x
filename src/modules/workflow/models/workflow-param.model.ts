import { $Enums, Prisma } from '@prisma/client';

export class WorkflowParam implements Prisma.WorkflowParamCreateInput {
  id: string;
  name?: string;
  root: Prisma.WorkflowCreateNestedOneWithoutParamsInput;
  ComponentParam?: Prisma.ComponentParamCreateNestedOneWithoutUsingParamsInput;
  usingNode?: Prisma.WorkflowNodeParamCreateNestedManyWithoutParamInput;
}

export class WorkflowNodeParam {
  id: string;
  type: $Enums.WorkflowNodeParamYype;
  param?: WorkflowParam;
}

export class WorkflowNodeInput extends WorkflowNodeParam {}

export class WorkflowNodeOutput extends WorkflowNodeParam {
  value?: string;
}
