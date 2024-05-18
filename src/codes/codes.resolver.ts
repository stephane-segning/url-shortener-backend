import { Resolver } from '@nestjs/graphql';
import { CodesService } from './codes.service';

@Resolver()
export class CodesResolver {
  constructor(private readonly codesService: CodesService) {}
}
