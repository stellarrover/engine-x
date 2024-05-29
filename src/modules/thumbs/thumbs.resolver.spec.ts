import { Test, TestingModule } from '@nestjs/testing';
import { ThumbsResolver } from './thumbs.resolver';
import { ThumbsService } from './thumbs.service';

describe('ThumbsResolver', () => {
  let resolver: ThumbsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThumbsResolver, ThumbsService],
    }).compile();

    resolver = module.get<ThumbsResolver>(ThumbsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
