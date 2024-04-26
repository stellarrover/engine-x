export type Process = {
  /**
   * 执行唯一标识
   */
  processId: string;

  /**
   * 执行前提供的信息
   */
  text?: string;

  /**
   * 所执行流程的实体唯一标识
   */
  workflowId: string;

  /**
   * 所执行流程的标题
   */
  workflowTitle: string;
};
