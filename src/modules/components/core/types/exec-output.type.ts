import { ProcessStructureModel } from 'src/modules/process/models/process-structure.model';

export type ExecOutput = {
  processStructure?: ProcessStructureModel;
  execResult?: unknown;
};
