import { Injectable } from '@nestjs/common';
import { CreateUiComponentInput } from './dto/create-ui-component.input';
import { PrismaService } from 'src/core/services/prisma';
import { nanoid } from 'nanoid';

@Injectable()
export class UiComponentRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, input: CreateUiComponentInput) {
    const workflow = await this.prisma.component.create({
      data: {
        id: nanoid(),
        creatorId: userId,
        // TODO - this is a temporary solution to avoid null values. need to define default value with i18n
        title: input.title ?? '',
        ...input,
      },
    });

    return workflow;
  }
}
