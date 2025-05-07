import { Test, TestingModule } from '@nestjs/testing';
import { PortabilityService } from './portability.service';

describe('PortabilityService', () => {
  let service: PortabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortabilityService],
    }).compile();

    service = module.get<PortabilityService>(PortabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
