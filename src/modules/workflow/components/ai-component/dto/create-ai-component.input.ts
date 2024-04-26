import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAiComponentInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
