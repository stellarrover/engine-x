import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Component, ComponentType } from '@prisma/client';

@ObjectType()
export class AiComponent implements Component {
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

  @Field(() => [], { nullable: true })
  metadata: any;

  type: ComponentType = ComponentType.AI;
}
