import { ProcessBlockModel } from 'src/modules/process/models/process-block.model';
import { Executor } from './executor.interface';
import { Storage } from './storage.interface';
import { SchedulerInput } from './types/scheduler-input.type';
import { ExecInput } from './types/exec-input.type';
import { ExecOutput } from './types/exec-output.type';

export abstract class Core implements Executor, Storage {
  constructor(
    protected processStructureFactory: ProcessStructureFactory,
    protected runTimeCacheFactory: RunTimeCacheFactory,
    protected combinedFlowService: CombinedFlowService,
  ) {}

  execResult!: unknown;

  // ⬇ 执行器 ---------------------------------------------------------------------------------------
  abstract verify(processBlock: ProcessBlockModel): boolean;
  abstract execute(params: SchedulerInput): Promise<void>;
  abstract final(
    params: SchedulerInput,
    result: ExecOutput,
  ): Promise<ExecOutput>;

  async scheduler(
    input: ExecInput,
    userId: string,
    visitorId?: string,
  ): Promise<ExecOutput> {
    const { processId, index, currentDate } = input;
    const processStructure =
      await this.processStructureFactory.buildFromCache(processId);

    if (input.index >= processStructure.titleList.length) throw new Error();

    const block = processStructure.processBlocks[index];

    const verified = this.verify(block);
    if (!verified) throw new Error();

    const { multipleLinkedList: originMultipleLinkedList, parameterList } =
      await this.combinedFlowService.getCombinedFlowMultiLink(
        processStructure.combinedFlowId,
        {
          isCompatibleAtomFlow: true,
          withEntity: true,
        },
      );

    const runTimeCache =
      await this.runTimeCacheFactory.buildFromCache(processId);

    const params = {
      processStructure,
      processBlock: block,
      index,
      currentDate,
      originMultipleLinkedList,
      parameterList,
      runTimeCache,
      processId,
      visitorId,
      userId,
    };

    await this.execute(params);

    return this.final(params, {
      processStructure,
      execResult: this.execResult,
    });
  }
  // ⬆ 执行器 ---------------------------------------------------------------------------------------

  // ⬇ 存储器 ---------------------------------------------------------------------------------------
  abstract setup(): void;
  // ⬆ 存储器 ---------------------------------------------------------------------------------------
}
