import { Test, TestingModule } from '@nestjs/testing';
import { UiComponentRepository } from './ui-component.repository';

describe('UiComponentRepository', () => {
  let repository: UiComponentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UiComponentRepository],
    }).compile();

    repository = module.get<UiComponentRepository>(UiComponentRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
