import { Test, TestingModule } from '@nestjs/testing';
import { RunTimeCacheService } from './run-time-cache.service';

describe('RunTimeCacheService', () => {
  let service: RunTimeCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RunTimeCacheService],
    }).compile();

    service = module.get<RunTimeCacheService>(RunTimeCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
