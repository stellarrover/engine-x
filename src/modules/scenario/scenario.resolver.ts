import { Resolver } from '@nestjs/graphql';
import { ScenarioService } from './scenario.service';

@Resolver()
export class ScenarioResolver {
  constructor(private readonly scenarioService: ScenarioService) {}
}
