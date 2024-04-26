import { Test, TestingModule } from '@nestjs/testing';
import { AiComponentRepository } from './ai-component.repository';

describe('AiComponentRepository', () => {
  let repository: AiComponentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiComponentRepository],
    }).compile();

    repository = module.get<AiComponentRepository>(AiComponentRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
