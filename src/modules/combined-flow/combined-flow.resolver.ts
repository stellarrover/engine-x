import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CombinedFlowService } from './combined-flow.service';

@Resolver()
export class CombinedFlowResolver {
  constructor(private readonly service: CombinedFlowService) {}

  // TODO - 保留
  @Mutation(() => Workflow, { description: '创建组合流程' })
  @Authorized()
  async createCombinedFlow(
    @Arg('input') input: CreateCombinedFlowInput,
    @CurrentUser() user: User,
  ): Promise<Workflow> {
    return await this.service.createCombinedFlow(input, user);
  }

  // TODO - 保留
  @Mutation(() => Workflow, { description: '编辑组合流程' })
  @Authorized()
  async modifyCombinedFlow(
    @Args('input', () => ModifyCombinedFlowInput)
    input: ModifyCombinedFlowInput,
    @Args('parameterList', () => [CombinedFlowParamInput], {
      description: '参数列表',
    })
    parameterList: CombinedFlowParamInput[],
    @CurrentUser() user: User,
  ): Promise<Workflow> {
    return await this.service.modifyCombinedFlow(input, user, parameterList);
  }
}
