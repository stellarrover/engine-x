import { Injectable } from '@nestjs/common';
import { SignInManager, SignInResult } from '../sign-in.manager';

@Injectable()
export class PwdManager<
  T extends { account: string; password: string } = {
    account: string;
    password: string;
  },
> extends SignInManager<T> {
  async validate(params: T): Promise<SignInResult> {
    const { account, password } = params;

    const pwdInfo = await this.prisma.user.findFirst({
      where: { account, password },
      include: { userRoles: true },
    });

    return pwdInfo
      ? SignInResult.Success.refreshUser(pwdInfo)
      : SignInResult.Failed;
  }
}
