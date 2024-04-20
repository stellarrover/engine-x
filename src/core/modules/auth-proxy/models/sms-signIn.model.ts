import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SmsSignInInput {
  @Field(() => String)
  account!: string;

  @Field(() => String)
  code!: string;
}
