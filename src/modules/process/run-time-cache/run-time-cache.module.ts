import { Module } from '@nestjs/common';
import { RunTimeCacheService } from './run-time-cache.service';
import { RunTimeCacheResolver } from './run-time-cache.resolver';

@Module({
  providers: [RunTimeCacheResolver, RunTimeCacheService],
})
export class RunTimeCacheModule {}
