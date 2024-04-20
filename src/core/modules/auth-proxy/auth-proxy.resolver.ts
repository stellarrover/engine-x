import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SocialManager } from './manager/adapters/social.manager';
import { WalletManager } from './manager/adapters/wallet.manager';
import { SocialSignInInput } from './models/social-oauth.model';
import { Logger, Req } from '@nestjs/common';
import { Request } from 'express';
import { walletSignInInput } from './models/wallet-signIn.model';
import { SmsManager } from './manager/adapters/sms.manager';
import { PwdManager } from './manager/adapters/pwd.manager';

@Resolver()
export class AuthProxyResolver {
  constructor(
    private readonly logger: Logger,
    private readonly socialManager: SocialManager,
    private readonly walletManager: WalletManager,
    private readonly smsManager: SmsManager,
    private readonly pwdManager: PwdManager,
  ) {}

  @Mutation(() => String, { description: '社交账号登录' })
  async socialSigIn(
    @Args({ name: 'input', type: () => SocialSignInInput })
    social: SocialSignInInput,
    @Req() req: Request,
  ) {
    const verified = await this.socialManager.execute(social);
    req;

    return verified;
  }

  @Mutation(() => String, { description: '钱包登录' })
  async walletSigIn(
    @Args({ name: 'input', type: () => walletSignInInput })
    wallet: walletSignInInput,
    @Req() req: Request,
  ) {
    const verified = await this.walletManager.execute(wallet);
    req;

    return verified;
  }

  @Mutation(() => String, { description: '短信登录' })
  async smsSigIn(
    @Args('phone') phone: string,
    @Args('code') code: string,
    @Req() req: Request,
  ) {
    req;

    return 'smsSigIn';
  }

  @Mutation(() => String, { description: '密码登录' })
  async pwdSigIn(
    @Args('account') account: string,
    @Args('password') password: string,
    @Req() req: Request,
  ) {
    const verified = await this.pwdManager.execute({ account, password });
    verified;
    req;
    return 'pwdSigIn';
  }
}
