import { Step } from '@imean/model';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Component, ComponentType } from '@prisma/client';
import { StepScalar } from '../dto/step.scalar';

@ObjectType()
export class UiComponent implements Component {
  @Field(() => String)
  id: string;

  createdAt: Date;

  updatedAt: Date;

  deleted: boolean;

  deletedAt: Date;

  creatorId: string;

  lastEditorId: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => Int)
  version: number;

  @Field(() => [StepScalar], { nullable: true })
  metaData: Step[] | null;

  type: ComponentType = ComponentType.UI;
}

const rest = new UiComponent();
rest.metaData = undefined;
