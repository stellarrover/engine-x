import { Module } from '@nestjs/common';
import { ThumbsService } from './thumbs.service';
import { ThumbsResolver } from './thumbs.resolver';

@Module({
  providers: [ThumbsResolver, ThumbsService],
})
export class ThumbsModule {}
