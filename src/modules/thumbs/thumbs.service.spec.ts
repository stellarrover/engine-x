import { Test, TestingModule } from '@nestjs/testing';
import { ThumbsService } from './thumbs.service';

describe('ThumbsService', () => {
  let service: ThumbsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThumbsService],
    }).compile();

    service = module.get<ThumbsService>(ThumbsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
