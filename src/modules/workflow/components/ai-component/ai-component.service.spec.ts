import { Test, TestingModule } from '@nestjs/testing';
import { AiComponentService } from './ai-component.service';

describe('AiComponentService', () => {
  let service: AiComponentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiComponentService],
    }).compile();

    service = module.get<AiComponentService>(AiComponentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
