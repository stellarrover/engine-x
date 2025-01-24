import { Test, TestingModule } from '@nestjs/testing';
import { AiSchedulerService } from './ai-scheduler.service';

describe('AiSchedulerService', () => {
  let service: AiSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiSchedulerService],
    }).compile();

    service = module.get<AiSchedulerService>(AiSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
