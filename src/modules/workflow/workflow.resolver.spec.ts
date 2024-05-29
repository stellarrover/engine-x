import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowResolver } from './workflow.resolver';
import { WorkflowService } from './workflow.service';

describe('WorkflowResolver', () => {
  let resolver: WorkflowResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkflowResolver, WorkflowService],
    }).compile();

    resolver = module.get<WorkflowResolver>(WorkflowResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
