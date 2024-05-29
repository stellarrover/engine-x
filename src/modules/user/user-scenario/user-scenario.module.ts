import { Module } from '@nestjs/common';
import { UserScenarioService } from './user-scenario.service';
import { UserScenarioResolver } from './user-scenario.resolver';

@Module({
  providers: [UserScenarioResolver, UserScenarioService],
})
export class UserScenarioModule {}
