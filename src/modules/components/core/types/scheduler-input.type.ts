import { ProcessBlockModel } from 'src/modules/process/models/process-block.model';
import { ProcessStructureModel } from 'src/modules/process/models/process-structure.model';
import { XMuLinList } from 'src/modules/workflow/models/workflow-mulinlist.model';

export type SchedulerInput = {
  processStructure: ProcessStructureModel;
  processBlock: ProcessBlockModel;
  index: number;
  currentDate?: string;
  originMultipleLinkedList: XMuLinList;
  parameterList: CombinedFlowParamOutput[];
  runTimeCache: RunTimeCacheModel;
  processId: string;
  visitorId?: string;
  userId: string;
};
