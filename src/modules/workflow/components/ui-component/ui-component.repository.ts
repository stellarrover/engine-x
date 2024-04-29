import { Injectable } from '@nestjs/common';
import { CreateUiComponentInput } from './dto/create-ui-component.input';
import { PrismaService } from 'src/core/services/prisma';
import { nanoid } from 'nanoid';
import { Component, ComponentType } from '@prisma/client';
import { Step } from '@imean/model';
import { UiComponentUtil } from './utils/ui-component.util';

@Injectable()
export class UiComponentRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, input: CreateUiComponentInput) {
    const UiComponent = await this.prisma.component.create({
      data: {
        id: nanoid(),
        creatorId: userId,
        // TODO - this is a temporary solution to avoid null values. need to define default value with i18n
        title: input.title ?? '',
        ...input,
      },
    });

    return UiComponent;
  }

  /**
   * Persistence of update parameters
   * @param root
   * @returns
   */
  async refreshOutputs(root: Component) {
    if (root.type !== ComponentType.UI) return;

    const params = UiComponentUtil.extractParamsForSteps(
      root.metadata as Step[],
      root.id,
    );

    const originParams = await this.prisma.componentParam.findMany({
      where: { componentId: root.id },
    });

    const { toCreate, toUpdate, toDelete } = UiComponentUtil.diffParams(
      originParams,
      params,
    );

    const transaction = [];

    toCreate.length &&
      transaction.push(
        this.prisma.componentParam.createMany({
          data: toCreate.map((param) => ({ ...param, componentId: root.id })),
        }),
      );

    toUpdate.length &&
      toUpdate.forEach((param) => {
        transaction.push(
          this.prisma.componentParam.update({
            where: { id: param.id },
            data: { name: param.name },
          }),
        );
      });

    toDelete.length &&
      transaction.push(
        this.prisma.componentParam.deleteMany({
          where: { id: { in: toDelete.map((param) => param.id) } },
        }),
      );

    await this.prisma.$transaction(transaction);
  }
}
