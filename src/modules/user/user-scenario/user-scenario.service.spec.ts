import { Test, TestingModule } from '@nestjs/testing';
import { UserScenarioService } from './user-scenario.service';

describe('UserScenarioService', () => {
  let service: UserScenarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserScenarioService],
    }).compile();

    service = module.get<UserScenarioService>(UserScenarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
