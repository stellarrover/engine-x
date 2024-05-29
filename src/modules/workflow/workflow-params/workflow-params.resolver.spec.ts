import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowParamsResolver } from './workflow-params.resolver';
import { WorkflowParamsService } from './workflow-params.service';

describe('WorkflowParamsResolver', () => {
  let resolver: WorkflowParamsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkflowParamsResolver, WorkflowParamsService],
    }).compile();

    resolver = module.get<WorkflowParamsResolver>(WorkflowParamsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
