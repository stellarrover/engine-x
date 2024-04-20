import { Injectable } from '@nestjs/common';
import { SignInManager, SignInResult } from '../auth-proxy.manager';

@Injectable()
export class PwdManager extends SignInManager {
  async validate(params: {
    account: string;
    password: string;
  }): Promise<SignInResult> {
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
