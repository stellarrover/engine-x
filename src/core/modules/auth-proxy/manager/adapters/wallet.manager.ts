import bs58 from 'bs58';
import { recoverPersonalSignature } from 'eth-sig-util';
import nacl from 'tweetnacl';
import {
  WalletLoginType,
  walletSignInInput,
} from '../../models/wallet-signIn.model';
import { Injectable } from '@nestjs/common';
import { SignInManager, SignInResult } from '../sign-in.manager';
import { User } from '@prisma/client';
import { nanoid } from 'nanoid';

export interface UserWalletInfo {
  provider: WalletLoginType;
  address: string;
}

@Injectable()
export class WalletManager<
  T extends walletSignInInput = walletSignInInput,
> extends SignInManager<T> {
  execute(wallet: T): Promise<SignInResult> {
    return super.execute(wallet);
  }

  async validate(wallet: T): Promise<SignInResult> {
    const info = await this.getUserWalletInfo(wallet.type, wallet);

    if (!info || !info.address) return SignInResult.Failed;

    const walletInfo = await this.prisma.userWalletInfo.findFirst({
      where: { address: info.address },
      include: { user: { include: { userRoles: true } } },
    });

    if (!walletInfo) {
      const user = await this.createUser({
        account: info.address,
      });

      await Promise.all([this.bindWalletUser(user as User, info)]);

      return SignInResult.Success.refreshUser({ ...user, userRoles: [] });
    }

    return SignInResult.Success.refreshUser(walletInfo.user);
  }

  private async getUserWalletInfo(
    type: WalletLoginType,
    wallet: walletSignInInput,
  ): Promise<UserWalletInfo | null> {
    let verified: boolean = false;
    switch (type) {
      case WalletLoginType.SOLANA:
        verified = nacl.sign.detached.verify(
          new TextEncoder().encode(wallet.message),
          bs58.decode(wallet.signature),
          bs58.decode(wallet.address),
        );
        break;

      case WalletLoginType.EVM:
        const recoveredAddress = recoverPersonalSignature({
          data: wallet.message,
          sig: wallet.signature,
        });
        verified =
          recoveredAddress.toLowerCase() === wallet.address.toLowerCase();
        break;

      default:
        verified = false;
    }

    return verified
      ? {
          provider: type,
          address: wallet.address,
        }
      : null;
  }

  private async bindWalletUser(user: User, info: UserWalletInfo) {
    await this.prisma.userWalletInfo.create({
      data: {
        id: nanoid(),
        address: info.address,
        userId: user.id,
        provider: info.provider,
      },
    });
  }
}
