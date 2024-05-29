import { Test, TestingModule } from '@nestjs/testing';
import { ProcessLabelService } from './process-label.service';

describe('ProcessLabelService', () => {
  let service: ProcessLabelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessLabelService],
    }).compile();

    service = module.get<ProcessLabelService>(ProcessLabelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
