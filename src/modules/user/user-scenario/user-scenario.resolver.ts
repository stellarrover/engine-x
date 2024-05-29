import { Resolver } from '@nestjs/graphql';
import { UserScenarioService } from './user-scenario.service';

@Resolver()
export class UserScenarioResolver {
  constructor(private readonly userScenarioService: UserScenarioService) {}
}
