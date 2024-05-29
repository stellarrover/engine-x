import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowAliasService } from './workflow-alias.service';

describe('WorkflowAliasService', () => {
  let service: WorkflowAliasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkflowAliasService],
    }).compile();

    service = module.get<WorkflowAliasService>(WorkflowAliasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
