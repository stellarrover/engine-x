import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserScenarioModule } from './user-scenario/user-scenario.module';
import { UserSettingsModule } from './user-settings/user-settings.module';

@Module({
  providers: [UserResolver, UserService],
  imports: [UserScenarioModule, UserSettingsModule],
})
export class UserModule {}
