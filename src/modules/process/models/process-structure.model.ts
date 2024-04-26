import { ProcessBlockModel } from './process-block.model';
import { XMuLinList } from '../../workflow/models/workflow-mulinlist.model';
import { Process } from '../types/process.type';
/**
 * 流程执行模型(此模型以workflow为基础进行建模),以线性结构表示执行列表
 */
export class ProcessStructureModel {
  constructor() {}

  private process: Process;

  /**
   * 流程名称列表
   */
  private _titleList: string[];
  get titleList(): string[] {
    return this._processBlocks.map((item) => item.component.title);
  }

  /**
   * 子流程执行状态列表(与titleList同顺序)，是多重链表转换的线性结构，流程规划时生成
   */
  private _processBlocks: ProcessBlockModel[];
  get processBlocks(): ProcessBlockModel[] {
    return this._processBlocks;
  }

  //   /**
  //    * 场景信息
  //    */
  //   private _scenarios: UserScenarioInput[];
  //   get scenarios(): UserScenarioInput[] {
  //     return this._scenarios;
  //   }

  /**
   * 原始子任务列表(用于AI进行流程分析)
   */
  private _originSubTaskList: {
    [key: string]: {
      [key: string]: string;
    };
  }[];
  get originSubTaskList() {
    return this._originSubTaskList;
  }

  /**
   * 通过规划的流程执行顺序(titleList),初始化组合流程进程执行块,若无规划顺序则生成回放数据
   * @param processBlocks
   */
  initProcessBlocks(
    originMuLinList: XMuLinList,
    // parameterList: CombinedFlowParamOutput[],
  ) {
    originMuLinList
      .toExecList()
      .forEach(() => this.processBlocks.push(new ProcessBlockModel()));
  }
}
