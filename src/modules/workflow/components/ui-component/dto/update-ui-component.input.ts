import { ComponentType } from '@prisma/client';
import { CreateUiComponentInput } from './create-ui-component.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUiComponentInput extends PartialType(
  CreateUiComponentInput,
) {
  @Field(() => Int)
  id: string;

  type: ComponentType = ComponentType.UI;
}
