import { Test, TestingModule } from '@nestjs/testing';
import { AiComponentResolver } from './ai-component.resolver';
import { AiComponentService } from './ai-component.service';

describe('AiComponentResolver', () => {
  let resolver: AiComponentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiComponentResolver, AiComponentService],
    }).compile();

    resolver = module.get<AiComponentResolver>(AiComponentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
