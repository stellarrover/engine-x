import { ComponentType } from '@imean/model';

export type ExecInput = {
  type: ComponentType;
  index: number;
  processId: string;
  currentDate?: string;
};
