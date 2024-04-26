import { InputType, Field } from '@nestjs/graphql';
import { ComponentType, Prisma } from '@prisma/client';
import { StepScalar } from './step.scalar';
import { Step } from '@imean/model';

@InputType()
export class CreateUiComponentInput
  implements Omit<Prisma.ComponentUncheckedCreateInput, 'id' | 'creatorId'>
{
  @Field(() => String, { nullable: true })
  title: string | null;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => [StepScalar], { nullable: true })
  metaData?: Step[];

  type: ComponentType = ComponentType.UI;
}
