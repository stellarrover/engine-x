import { Test, TestingModule } from '@nestjs/testing';
import { UiComponentService } from './ui-component.service';

describe('UiComponentService', () => {
  let service: UiComponentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UiComponentService],
    }).compile();

    service = module.get<UiComponentService>(UiComponentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
