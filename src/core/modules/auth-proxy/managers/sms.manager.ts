import { Injectable } from '@nestjs/common';
import { SignInManager, SignInResult } from '../auth-proxy.manager';

@Injectable()
export class SmsManager extends SignInManager {
  validate(): Promise<SignInResult> {
    throw new Error('Method not implemented.');
  }
}
