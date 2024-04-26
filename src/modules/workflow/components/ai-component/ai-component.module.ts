import { Module } from '@nestjs/common';
import { AiComponentService } from './ai-component.service';
import { AiComponentResolver } from './ai-component.resolver';

@Module({
  providers: [AiComponentResolver, AiComponentService],
})
export class AiComponentModule {}
