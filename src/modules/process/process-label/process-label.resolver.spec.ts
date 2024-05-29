import { Test, TestingModule } from '@nestjs/testing';
import { ProcessLabelResolver } from './process-label.resolver';
import { ProcessLabelService } from './process-label.service';

describe('ProcessLabelResolver', () => {
  let resolver: ProcessLabelResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessLabelResolver, ProcessLabelService],
    }).compile();

    resolver = module.get<ProcessLabelResolver>(ProcessLabelResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
