import { Test, TestingModule } from '@nestjs/testing';
import { ProcessResultResolver } from './process-result.resolver';
import { ProcessResultService } from './process-result.service';

describe('ProcessResultResolver', () => {
  let resolver: ProcessResultResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessResultResolver, ProcessResultService],
    }).compile();

    resolver = module.get<ProcessResultResolver>(ProcessResultResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
