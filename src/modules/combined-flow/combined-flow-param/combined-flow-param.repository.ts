import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { WorkflowNodeType } from '../enums/workflowNode.enum';
import { WorkflowParamType } from '../enums/workflowParam.enum';
import {
  CombinedFlowParamInput,
  CombinedFlowParamOutput,
} from '../types/combinedFlow.dto';
import { NameCounter } from './utils/combinedFlowParam.utils';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma';
import { WorkflowMultipleLinkedList } from '../combined-structure/models/workflow-multiple-linked-list.model';

@Injectable()
export class CombinedFlowParamRepository {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * 获取组合流程参数列表。
   * 忽略不可用参数（原子流程参数中软删的）
   * @param combinedFlowId
   * @returns
   */
  async getCombinedFlowParams(
    workflowId: string,
    isCompatibleAtomFlow?: boolean,
  ): Promise<CombinedFlowParamOutput[]> {
    let params = await this.prisma.combinedFlowParam
      .findMany({
        where: {
          combinedFlowId: workflowId,
          OR: [
            {
              atomFlowOutput: {
                deleted: false,
              },
            },
            { atomFlowOutputId: null },
          ],
        },
        select: {
          id: true,
          name: true,
          type: true,
          atomFlowOutputId: true,
          atomFlowOutput: true,
          componentOutputId: true,
          componentOutput: true,
        },
      })
      .then((res) =>
        res.map((param) => ({
          id: param.id,
          name: param.name,
          type: param.type,
          subType: param.componentOutput?.subType,
          originName:
            param.type === WorkflowParamType.Query
              ? param.name!
              : (param.componentOutput?.name ?? param.atomFlowOutput?.name)!,
          atomFlowOutputId: param.atomFlowOutputId,
          componentOutputId: param.componentOutputId,
        })),
      );

    if (isCompatibleAtomFlow && !params.length) {
      params = await this.prisma.atomFlowOutput
        .findMany({
          where: {
            workflowId,
            deleted: false,
          },
        })
        .then((res) =>
          res.map((param) => ({
            id: param.id,
            name: null,
            type: param.type,
            subType: null,
            originName: param.name,
            atomFlowOutputId: param.id,
            componentOutputId: null,
          })),
        );
    }

    return params;
  }

  async getWorkflowNodeParamsByNodeId(nodeId: string) {
    const inputs = await this.prisma.workflowNodeInput.findMany({
      where: {
        nodeId,
      },
    });

    const outputs = await this.prisma.workflowNodeOutput.findMany({
      where: {
        nodeId,
        param: {
          OR: [
            {
              atomFlowOutput: {
                deleted: false,
              },
            },
            {
              atomFlowOutputId: null,
            },
          ],
        },
      },
      select: {
        id: true,
        paramId: true,
      },
    });

    return {
      inputs,
      outputs,
    };
  }

  async createCombinedFlowParams(
    workflowMultipleLinkedList: WorkflowMultipleLinkedList,
    combinedFlowId: string,
  ) {
    // 名称计数器，用于处理重名参数
    const nameCounter = new NameCounter();
    const combinedFlowParams: Prisma.CombinedFlowParamCreateManyInput[] = [];
    const transaction = [];

    const nodes = workflowMultipleLinkedList.flatten().map((node) => ({
      id: node.id,
      type: node.type,
      atomFlowId: node.atomFlowId,
      componentId: node.componentId,
    }));

    for (const node of nodes) {
      let params: {
        type: string;
        atomFlowOutputId?: string;
        componentOutputId?: string;
        originName: string;
      }[] = [];
      if (node.type === WorkflowNodeType.AtomFlow && node.atomFlowId) {
        params = await this.prisma.atomFlowOutput
          .findMany({
            where: { workflowId: node.atomFlowId },
          })
          .then((res) =>
            res.map((item) => ({
              type: item.type,
              atomFlowOutputId: item.id,
              originName: item.name,
            })),
          );
      } else if (node.type === WorkflowNodeType.Component && node.componentId) {
        params = await this.prisma.componentOutput
          .findMany({
            where: { componentId: node.componentId },
          })
          .then((res) =>
            res.map((item) => ({
              type: item.type,
              componentOutputId: item.id,
              originName: item.name,
            })),
          );
      }

      params.forEach((param) => {
        const combinedFlowParamId = nanoid();
        combinedFlowParams.push({
          id: combinedFlowParamId,
          combinedFlowId,
          atomFlowOutputId: param.atomFlowOutputId,
          componentOutputId: param.componentOutputId,
          type: param.type,
          // 只有在参数中存在重名时才会添加后缀赋予别名
          name: nameCounter.getNumber(param.originName)
            ? `${param.originName}_${nameCounter.getNumber(param.originName)}`
            : null,
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
        nameCounter.increment(param.originName);
      });
    }

    combinedFlowParams.push({
      id: nanoid(),
      combinedFlowId,
      atomFlowOutputId: undefined,
      componentOutputId: undefined,
      type: WorkflowParamType.Query,
      name: 'query',
    });

    transaction.unshift(
      this.prisma.combinedFlowParam.createMany({ data: combinedFlowParams }),
    );
    transaction.push(
      this.prisma.recording.update({
        where: { id: combinedFlowId },
        data: { isParamGenerated: true },
      }),
    );

    await this.prisma.$transaction(transaction);
  }

  async modifyCombinedFlowParams(
    combinedFlowId: string,
    parameterList: CombinedFlowParamInput[],
  ) {
    const toUpsert: CombinedFlowParamInput[] = [];
    const transaction = [];

    const originParams = await this.prisma.combinedFlowParam.findMany({
      where: {
        combinedFlowId,
      },
    });
    const paramsNeededDelete = new Set(originParams);

    parameterList.forEach((newParam) => {
      const oldParam = originParams.find((param) => param.id === newParam.id);
      if (!oldParam || oldParam.name !== newParam.name) toUpsert.push(newParam);
      oldParam && paramsNeededDelete.delete(oldParam);
    });

    for (const param of toUpsert) {
      transaction.push(
        this.prisma.combinedFlowParam.upsert({
          where: { id: param.id },
          create: {
            id: param.id,
            combinedFlowId,
            type: param.type,
            atomFlowOutputId: param.atomFlowOutputId,
            componentOutputId: param.componentOutputId,
            name: param.name,
          },
          update: { name: param.name },
        }),
      );
    }

    // 不删除由原子流程产生的参数，以实现参数复现的功能
    for (const param of [...paramsNeededDelete]) {
      !param.atomFlowOutputId &&
        transaction.push(
          this.prisma.combinedFlowParam.delete({
            where: { id: param.id },
          }),
        );
    }

    await this.prisma.$transaction(transaction);
  }
}
