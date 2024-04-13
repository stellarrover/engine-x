import { Injectable } from '@nestjs/common';
import { walletManager } from './managers/wallet-manager';
import { walletSignInInput } from './models/wallet-signIn.model';
import { PrismaService } from 'src/core/services/prisma';
import { User } from '@prisma/client';
import { nanoid } from 'nanoid';
import { SocialUser, socialManager } from './managers/social-manager';
import { SocialSignInInput } from './models/social-oauth.model';

@Injectable()
export class AuthProxyService {
  constructor(private prisma: PrismaService) {}

  /**
   * 钱包登录
   * @param wallet
   * @returns
   */
  async walletSigIn(wallet: walletSignInInput) {
    const walletUser = await walletManager
      .get(wallet.addressType)
      .getUser(wallet);

    if (!walletUser || !walletUser.address) throw new Error('todo error');

    const walletInfo = await this.prisma.userWalletInfo.findFirst({
      where: { address: walletUser.address },
      include: { user: { include: { userRoles: true } } },
    });

    if (!walletInfo) {
      const user = await this.createUser({
        username: walletUser.address,
      });
      const token = `todo token${user}`;

      await Promise.all([
        // this.bindWalletUser(user as User, walletUser),
        // this.authService.resetUserSession(user, token),
        // this.clearUserCache(user.id),
      ]);
      return { token };
    }
    const token = `todo token`;
    // const token = CacheKeys.genUserSessionToken(walletInfo.user.id);

    // await this.authService.resetUserSession(walletInfo.user, token);
    return { token };
  }

  /**
   * 社交账号登录
   * @param social
   * @returns
   */
  async socialSigIn(social: SocialSignInInput) {
    const socialUser: SocialUser = await socialManager
      .get(social.type)
      .getUser(social.code);

    const socialInfo = await this.prisma.userSocialInfo.findFirst({
      where: { openId: socialUser.openId },
      include: { user: { include: { userRoles: true } } },
    });

    if (!socialInfo) {
      const user = await this.createUser({
        username: socialUser.email,
        nickname:
          socialUser?.nickname ??
          socialUser.email.match(/^((\w)+(\.\w+)*)@.*/)?.[1].substring(0, 8) ??
          nanoid(5),
        avatar: socialUser?.avatar ?? null,
      });
      const token = `todo token${user}`;

      await Promise.all([
        // this.bindSocialUser(user as User, walletUser),
        // this.authService.resetUserSession(user, token),
        // this.clearUserCache(user.id),
      ]);
      return { token };
    }
    const token = `todo token`;
    // const token = CacheKeys.genUserSessionToken(walletInfo.user.id);

    // await this.authService.resetUserSession(walletInfo.user, token);
    return { token };
  }

  async smsSigIn() {}

  async pwdSigIn() {}

  async signOut() {}

  private async createUser(
    data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        id: nanoid(),
        username: data.username ?? nanoid(),
      },
    });
    return user;
  }
}
