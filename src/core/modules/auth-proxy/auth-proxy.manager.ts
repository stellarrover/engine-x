import { Injectable } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/core/services/prisma';

export class SignInResult {
  constructor(succeeded?: boolean, user?: User & { userRoles: UserRole[] }) {
    this.Succeeded = succeeded;
    this.user = user;
    this.IsLockedOut = false;
    this.IsNotAllowed = false;
    this.RequiresTwoFactor = false;
  }

  Succeeded: boolean;

  IsLockedOut: boolean;

  IsNotAllowed: boolean;

  RequiresTwoFactor: boolean;

  static Success = new SignInResult(true);
  static Failed = new SignInResult(false);

  user: User & { userRoles: UserRole[] };

  refreshUser(user: User & { userRoles: UserRole[] }) {
    this.user = user;
    return this;
  }
}

@Injectable()
export abstract class SignInManager {
  constructor(protected readonly prisma: PrismaService) {}

  protected async execute(params?: object): Promise<SignInResult> {
    const verified = await this.validate(params);

    if (verified.Succeeded) {
      return verified;
    }

    return verified;
  }

  abstract validate(params?: object): Promise<SignInResult>;

  protected async createUser(
    data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        id: nanoid(),
        account: data.account ?? nanoid(),
      },
    });
    return user;
  }
}
