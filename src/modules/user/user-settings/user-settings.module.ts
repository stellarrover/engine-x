import { Module } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsResolver } from './user-settings.resolver';

@Module({
  providers: [UserSettingsResolver, UserSettingsService],
})
export class UserSettingsModule {}
