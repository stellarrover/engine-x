import bs58 from 'bs58';
import { recoverPersonalSignature } from 'eth-sig-util';
import nacl from 'tweetnacl';
import {
  WalletLoginType,
  walletSignInInput,
} from '../models/wallet-signIn.model';

export interface WalletUser {
  provider: WalletLoginType;
  address: string;
}

export interface WalletInterface {
  getUser(wallet: walletSignInInput): Promise<WalletUser | null>;
}

export class WalletManager {
  private async getUser(
    type: WalletLoginType,
    wallet: walletSignInInput,
  ): Promise<WalletUser> {
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
        throw new Error(`Invalid wallet type: ${type}`);
    }

    return verified
      ? {
          provider: type,
          address: wallet.address,
        }
      : null;
  }

  get(type: WalletLoginType): WalletInterface {
    return {
      getUser: async (wallet: walletSignInInput) => {
        return this.getUser(type, wallet);
      },
    };
  }
}

export const walletManager = new WalletManager();
