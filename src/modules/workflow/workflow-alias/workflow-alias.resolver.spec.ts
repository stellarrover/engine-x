import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowAliasResolver } from './workflow-alias.resolver';
import { WorkflowAliasService } from './workflow-alias.service';

describe('WorkflowAliasResolver', () => {
  let resolver: WorkflowAliasResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkflowAliasResolver, WorkflowAliasService],
    }).compile();

    resolver = module.get<WorkflowAliasResolver>(WorkflowAliasResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
