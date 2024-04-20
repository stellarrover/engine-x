import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum WalletLoginType {
  SOLANA = 'SOLANA',
  EVM = 'EVM',
}

@InputType()
export class walletSignInInput {
  @Field(() => WalletLoginType)
  type!: WalletLoginType;

  @Field(() => String, { description: '地址' })
  address!: string;

  @Field(() => String, { description: '消息' })
  message!: string;

  @Field(() => String, { description: '签名' })
  signature!: string;

  @Field(() => String, { description: '公钥' })
  publicKey!: string;
}

registerEnumType(WalletLoginType, {
  name: 'WalletLoginType',
  description: '钱包登录类型',
  valuesMap: {
    SOLANA: {
      description: 'SOLANA',
    },
    EVM: {
      description: '以太坊',
    },
  },
});
