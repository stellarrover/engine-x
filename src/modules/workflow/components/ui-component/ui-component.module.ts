import { Module } from '@nestjs/common';
import { UiComponentService } from './ui-component.service';
import { UiComponentResolver } from './ui-component.resolver';
import { StepScalar } from './dto/step.scalar';

@Module({
  providers: [UiComponentResolver, UiComponentService, StepScalar],
})
export class UiComponentModule {}
