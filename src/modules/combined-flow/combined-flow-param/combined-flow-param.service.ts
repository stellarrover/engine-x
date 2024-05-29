import { Injectable } from '@nestjs/common';
import { CombinedFlowParamRepository } from './combined-flow-param.repository';
import { WorkflowMultipleLinkedListFactoryOptions } from '../combined-structure/models/workflow-multiple-linked-list.factory';
import { AtomFlowOutput, Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { WorkflowMultipleLinkedList } from '../combined-structure/models/workflow-multiple-linked-list.model';
import { WorkflowParamType } from '../enums/workflowParam.enum';
import {
  CombinedFlowParamOutput,
  CombinedFlowParamInput,
} from '../types/combinedFlow.dto';
import { PrismaService } from 'src/core/services/prisma';

@Injectable()
export class CombinedFlowParamService {
  constructor(
    private readonly repository: CombinedFlowParamRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * 获取流程参数列表。
   * 忽略不可用参数（原子流程参数中软删的）
   * @param combinedFlowId
   * @returns
   */
  async getCombinedFlowParams(
    combinedFlowId: string,
    options?: WorkflowMultipleLinkedListFactoryOptions,
    unFilterParamForQuery?: boolean,
  ): Promise<{
    parameterList: CombinedFlowParamOutput[];
    paramIdMapping: Map<string, string> | undefined;
  }> {
    let parameterList = await this.repository.getCombinedFlowParams(
      combinedFlowId,
      options?.isCompatibleAtomFlow,
    );
    const paramIdMapping = new Map<string, string>();

    if (options?.isRandomId) {
      !unFilterParamForQuery &&
        (parameterList = parameterList.filter(
          (param) => param.type !== WorkflowParamType.Query,
        ));
      parameterList.forEach((param) => {
        const randomId = nanoid();
        paramIdMapping.set(param.id, randomId);
        param.id = randomId;
      });
    }

    return {
      parameterList,
      paramIdMapping: options?.isRandomId ? paramIdMapping : undefined,
    };
  }

  /**
   * 生成参数列表。
   * 根据组合流程ID创建组合流程参数列表以及流程节点出参。
   * @param combinedFlowId
   * @returns
   */
  async createCombinedFlowParams(
    workflowMultipleLinkedList: WorkflowMultipleLinkedList,
    combinedFlowId: string,
  ) {
    return await this.repository.createCombinedFlowParams(
      workflowMultipleLinkedList,
      combinedFlowId,
    );
  }

  /**
   * 调整参数列表。
   * @param combinedFlowId
   * @param parameterList
   * @returns
   */
  async modifyCombinedFlowParams(
    combinedFlowId: string,
    parameterList: CombinedFlowParamInput[],
  ) {
    return await this.repository.modifyCombinedFlowParams(
      combinedFlowId,
      parameterList,
    );
  }

  /**
   * 同步原子流程参数的更改。
   * 当原子流程新增出参时，更新所有引用了该原子流程的组合流程的参数列表以及对应节点的出参。
   */
  async modifyCombinedFlowParamsForAtomFlowChange(
    newParams: AtomFlowOutput[],
    atomFlowId: string,
  ) {
    const transaction = [];
    const combinedFlowParams: Prisma.CombinedFlowParamCreateManyInput[] = [];

    const usingNodes = await this.prisma.recording
      .findUnique({
        where: {
          id: atomFlowId,
        },
        select: {
          usingNodes: {
            select: {
              id: true,
              combinedFlow: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      })
      .then((res) => res?.usingNodes);

    if (!usingNodes) return;

    for (const node of usingNodes) {
      for (const param of newParams) {
        const combinedFlowParamId = nanoid();
        combinedFlowParams.push({
          id: combinedFlowParamId,
          combinedFlowId: node.combinedFlow.id,
          atomFlowOutputId: param.id,
          type: param.type,
        });
        transaction.push(
          this.prisma.workflowNodeOutput.createMany({
            data: {
              id: nanoid(),
              nodeId: node.id,
              paramId: combinedFlowParamId,
            },
          }),
        );
      }
    }
    transaction.unshift(
      this.prisma.combinedFlowParam.createMany({ data: combinedFlowParams }),
    );

    await this.prisma.$transaction(transaction);
  }

  async duplicateCombinedFlowParams(
    newCombinedFlowId: string,
    oldCombinedFlowId: string,
    nodeIdMapping: Map<string, string>,
  ) {
    const transaction = [];
    const combinedFlowParams: Prisma.CombinedFlowParamCreateManyInput[] = [];
    const workflowOutputs: Prisma.WorkflowNodeOutputCreateManyInput[] = [];
    const workflowInputs: Prisma.WorkflowNodeInputCreateManyInput[] = [];
    // 获取旧的参数列表
    const { parameterList, paramIdMapping } = await this.getCombinedFlowParams(
      oldCombinedFlowId,
      { isRandomId: true },
      true,
    );
    parameterList.forEach((param) => {
      combinedFlowParams.push({
        id: param.id,
        combinedFlowId: newCombinedFlowId,
        atomFlowOutputId: param.atomFlowOutputId,
        componentOutputId: param.componentOutputId,
        name: param.name,
        type: param.type,
      });
    });
    transaction.unshift(
      this.prisma.combinedFlowParam.createMany({ data: combinedFlowParams }),
    );

    const outputs = await this.prisma.workflowNodeOutput.findMany({
      where: {
        nodeId: {
          in: Array.from(nodeIdMapping.keys()),
        },
      },
    });
    outputs.forEach((output) => {
      workflowOutputs.push({
        id: nanoid(),
        nodeId: nodeIdMapping.get(output.nodeId)!,
        paramId: paramIdMapping?.get(output.paramId) ?? output.paramId,
      });
    });

    const inputs = await this.prisma.workflowNodeInput.findMany({
      where: {
        nodeId: {
          in: Array.from(nodeIdMapping.keys()),
        },
      },
    });
    inputs.forEach((input) => {
      workflowInputs.push({
        id: nanoid(),
        nodeId: nodeIdMapping.get(input.nodeId)!,
        paramId: paramIdMapping?.get(input.paramId) ?? input.paramId,
        usingPromptLabel: input.usingPromptLabel,
      });
    });

    transaction.push(
      this.prisma.workflowNodeOutput.createMany({ data: workflowOutputs }),
    );
    transaction.push(
      this.prisma.workflowNodeInput.createMany({ data: workflowInputs }),
    );

    await this.prisma.$transaction(transaction);
  }
}
