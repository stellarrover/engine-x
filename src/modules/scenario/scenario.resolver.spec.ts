import { Test, TestingModule } from '@nestjs/testing';
import { ScenarioResolver } from './scenario.resolver';
import { ScenarioService } from './scenario.service';

describe('ScenarioResolver', () => {
  let resolver: ScenarioResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScenarioResolver, ScenarioService],
    }).compile();

    resolver = module.get<ScenarioResolver>(ScenarioResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
