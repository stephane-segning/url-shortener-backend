import { Test, TestingModule } from '@nestjs/testing';
import { Oauth2TokenService } from './oauth2-token.service';

describe('Oauth2TokenService', () => {
  let service: Oauth2TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Oauth2TokenService],
    }).compile();

    service = module.get<Oauth2TokenService>(Oauth2TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
