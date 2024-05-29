import { Test, TestingModule } from '@nestjs/testing';
import { UserScenarioResolver } from './user-scenario.resolver';
import { UserScenarioService } from './user-scenario.service';

describe('UserScenarioResolver', () => {
  let resolver: UserScenarioResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserScenarioResolver, UserScenarioService],
    }).compile();

    resolver = module.get<UserScenarioResolver>(UserScenarioResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
