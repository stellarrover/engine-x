import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowParamsService } from './workflow-params.service';

describe('WorkflowParamsService', () => {
  let service: WorkflowParamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkflowParamsService],
    }).compile();

    service = module.get<WorkflowParamsService>(WorkflowParamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
