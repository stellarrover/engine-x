import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PwdSignInInput {
  @Field(() => String)
  account!: string;

  @Field()
  password!: string;
}
