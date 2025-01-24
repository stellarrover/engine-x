import { Module } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { ComponentsResolver } from './components.resolver';

@Module({
  providers: [ComponentsResolver, ComponentsService],
})
export class ComponentsModule {}
