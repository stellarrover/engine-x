import { Module } from '@nestjs/common';
import { CombinedFlowService } from './combined-flow.service';
import { CombinedFlowResolver } from './combined-flow.resolver';
import { CombinedFlowParamModule } from './combined-flow-param/combined-flow-param.module';
import { CombinedStructureModule } from './combined-structure/combined-structure.module';
import { TestModule } from './test/test.module';

@Module({
  providers: [CombinedFlowResolver, CombinedFlowService],
  imports: [CombinedFlowParamModule, CombinedStructureModule, TestModule],
})
export class CombinedFlowModule {}
