import { Test, TestingModule } from '@nestjs/testing';
import { ProcessResolver } from './process.resolver';
import { ProcessService } from './process.service';

describe('ProcessResolver', () => {
  let resolver: ProcessResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessResolver, ProcessService],
    }).compile();

    resolver = module.get<ProcessResolver>(ProcessResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
