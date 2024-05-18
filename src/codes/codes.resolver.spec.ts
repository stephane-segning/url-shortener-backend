import { Test, TestingModule } from '@nestjs/testing';
import { CodesResolver } from './codes.resolver';
import { CodesService } from './codes.service';

describe('CodesResolver', () => {
  let resolver: CodesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodesResolver, CodesService],
    }).compile();

    resolver = module.get<CodesResolver>(CodesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
