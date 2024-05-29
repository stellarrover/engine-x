import { Resolver } from '@nestjs/graphql';
import { RunTimeCacheService } from './run-time-cache.service';

@Resolver()
export class RunTimeCacheResolver {
  constructor(private readonly runTimeCacheService: RunTimeCacheService) {}
}
