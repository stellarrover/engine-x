import { Test, TestingModule } from '@nestjs/testing';
import { UiComponentResolver } from './ui-component.resolver';
import { UiComponentService } from './ui-component.service';

describe('UiComponentResolver', () => {
  let resolver: UiComponentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UiComponentResolver, UiComponentService],
    }).compile();

    resolver = module.get<UiComponentResolver>(UiComponentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
