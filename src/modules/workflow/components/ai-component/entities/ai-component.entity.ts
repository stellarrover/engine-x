import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class AiComponent {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
