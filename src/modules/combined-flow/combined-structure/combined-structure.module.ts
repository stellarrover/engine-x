import { Module } from '@nestjs/common';
import { CombinedStructureService } from './combined-structure.service';

@Module({
  providers: [CombinedStructureResolver, CombinedStructureService],
})
export class CombinedStructureModule {}
