import { CreateWorkflowInput } from './create-workflow-input.type';

export type UpdateWorkflowInput = Partial<CreateWorkflowInput> & {
  id: string;
};
