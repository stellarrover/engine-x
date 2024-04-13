import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum SocialLoginType {
  GOOGLE = 'Google',
  FACEBOOK = 'Facebook',
  TWITTER = 'Twitter',
  LINKEDIN = 'LinkedIn',
  GITHUB = 'GitHub',
  AMAZON = 'Amazon',
  MICROSOFT = 'Microsoft',
  APPLE = 'Apple',
  INSTAGRAM = 'Instagram',
  TIKTOK = 'TikTok',
  QQ = 'QQ',
  WEIBO = 'Weibo',
  WECHAT = 'WeChat',
}

@InputType()
export class SocialSignInInput {
  @Field()
  code!: string;

  @Field(() => SocialLoginType)
  type!: SocialLoginType;

  @Field(() => Boolean, { nullable: true })
  inactive?: boolean;
}

registerEnumType(SocialLoginType, {
  name: 'SocialLoginType',
  description: '社交登录类型',
  valuesMap: {},
});
