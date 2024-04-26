import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AiComponentService } from './ai-component.service';
import { AiComponent } from './entities/ai-component.entity';
import { CreateAiComponentInput } from './dto/create-ai-component.input';
import { UpdateAiComponentInput } from './dto/update-ai-component.input';

@Resolver(() => AiComponent)
export class AiComponentResolver {
  constructor(private readonly aiComponentService: AiComponentService) {}

  @Mutation(() => AiComponent)
  createAiComponent(
    @Args('createAiComponentInput')
    createAiComponentInput: CreateAiComponentInput,
  ) {
    return this.aiComponentService.create(createAiComponentInput);
  }

  @Query(() => [AiComponent], { name: 'aiComponent' })
  findAll() {
    return this.aiComponentService.findAll();
  }

  @Query(() => AiComponent, { name: 'aiComponent' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.aiComponentService.findOne(id);
  }

  @Mutation(() => AiComponent)
  updateAiComponent(
    @Args('updateAiComponentInput')
    updateAiComponentInput: UpdateAiComponentInput,
  ) {
    return this.aiComponentService.update(
      updateAiComponentInput.id,
      updateAiComponentInput,
    );
  }

  @Mutation(() => AiComponent)
  removeAiComponent(@Args('id', { type: () => Int }) id: number) {
    return this.aiComponentService.remove(id);
  }
}
