import { Injectable } from '@nestjs/common';
import { walletSignInInput } from './models/wallet-signIn.model';
import { SocialManager } from './managers/social.manager';
import { SocialSignInInput } from './models/social-oauth.model';
import { WalletManager } from './managers/wallet.manager';

@Injectable()
export class AuthProxyService {
  constructor(
    private readonly socialManager: SocialManager,
    private readonly walletManager: WalletManager,
  ) {}

  /**
   * 钱包登录
   * @param wallet
   * @returns
   */
  async walletSigIn(wallet: walletSignInInput) {
    const verified = await this.walletManager.execute(wallet);

    return verified;
  }

  /**
   * 社交账号登录
   * @param social
   * @returns
   */
  async socialSigIn(social: SocialSignInInput) {
    const verified = await this.socialManager.execute(social);

    return verified;
  }

  async smsSigIn() {}

  async pwdSigIn() {}

  async signOut() {}
}
