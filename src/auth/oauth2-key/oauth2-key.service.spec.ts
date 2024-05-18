import { Test, TestingModule } from '@nestjs/testing';
import { Oauth2KeyService } from './oauth2-key.service';

describe('Oauth2KeyService', () => {
  let service: Oauth2KeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Oauth2KeyService],
    }).compile();

    service = module.get<Oauth2KeyService>(Oauth2KeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
