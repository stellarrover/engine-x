import { Test, TestingModule } from '@nestjs/testing';
import { ProcessResultService } from './process-result.service';

describe('ProcessResultService', () => {
  let service: ProcessResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessResultService],
    }).compile();

    service = module.get<ProcessResultService>(ProcessResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
