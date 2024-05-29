import { Module } from '@nestjs/common';
import { ScenarioService } from './scenario.service';
import { ScenarioResolver } from './scenario.resolver';

@Module({
  providers: [ScenarioResolver, ScenarioService],
})
export class ScenarioModule {}
