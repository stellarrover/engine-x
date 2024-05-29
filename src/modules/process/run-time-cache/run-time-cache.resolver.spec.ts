import { Test, TestingModule } from '@nestjs/testing';
import { RunTimeCacheResolver } from './run-time-cache.resolver';
import { RunTimeCacheService } from './run-time-cache.service';

describe('RunTimeCacheResolver', () => {
  let resolver: RunTimeCacheResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RunTimeCacheResolver, RunTimeCacheService],
    }).compile();

    resolver = module.get<RunTimeCacheResolver>(RunTimeCacheResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
