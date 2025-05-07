import { Test, TestingModule } from '@nestjs/testing';
import { PortabilityController } from './portability.controller';
import { PortabilityService } from './portability.service';

describe('PortabilityController', () => {
  let controller: PortabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortabilityController],
      providers: [PortabilityService],
    }).compile();

    controller = module.get<PortabilityController>(PortabilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
