import { Module } from '@nestjs/common';

/**
 * Process scheduler module
 * 专注于流程的调度功能
 *
 * @description
 * 支持以下调度方式：
 *      1. 完全前台调度：前台调度器负责调度流程的执行，流程的执行完全依赖于前台调度器，只提前准备好下一个block的数据
 *      2. 完全后台调度：无UI组件的流程，自动调度流程的执行
 *      3. 前后台混合调度：...
 *      4. 定时调度：定时调度器负责调度流程的执行
 *      5. ...
 */
@Module({})
export class ProcessSchedulerModule {}
