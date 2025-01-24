import { ProcessBlockModel } from 'src/modules/process/models/process-block.model';
import { ExecInput } from './types/exec-input.type';
import { ExecOutput } from './types/exec-output.type';
import { SchedulerInput } from './types/scheduler-input.type';

/**
 * 执行器
 */
export interface Executor {
  /**
   * 调度中心
   * @param input
   */
  scheduler(
    input: ExecInput,
    userId: string,
    visitorId?: string,
  ): Promise<ExecOutput>;

  /**
   * 验证模块，主要用于验证block，由子类进行实现
   * @param processBlock
   */
  verify(processBlock: ProcessBlockModel): void;

  /**
   * 执行模块，由子类进行实现具体业务逻辑
   * @param params
   */
  execute(params: SchedulerInput): Promise<void>;

  /**
   * 用于业务逻辑执行后的持久化以及日志
   */
  final(params: SchedulerInput, result: ExecOutput): Promise<ExecOutput>;
}
