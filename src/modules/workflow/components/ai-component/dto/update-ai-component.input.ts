import { CreateAiComponentInput } from './create-ai-component.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAiComponentInput extends PartialType(CreateAiComponentInput) {
  @Field(() => Int)
  id: number;
}
