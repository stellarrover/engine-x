import { Test, TestingModule } from '@nestjs/testing';
import { ProcessBlockService } from './process-block.service';

describe('ProcessBlockService', () => {
  let service: ProcessBlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessBlockService],
    }).compile();

    service = module.get<ProcessBlockService>(ProcessBlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
