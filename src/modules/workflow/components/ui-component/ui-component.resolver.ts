import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UiComponentService } from './ui-component.service';
import { UiComponent } from './entities/ui-component.entity';
import { CreateUiComponentInput } from './dto/create-ui-component.input';
import { UpdateUiComponentInput } from './dto/update-ui-component.input';

@Resolver(() => UiComponent)
export class UiComponentResolver {
  constructor(private readonly uiComponentService: UiComponentService) {}

  @Mutation(() => UiComponent)
  createUiComponent(
    @Args('createUiComponentInput')
    createUiComponentInput: CreateUiComponentInput,
  ) {
    return this.uiComponentService.create(createUiComponentInput);
  }

  @Query(() => [UiComponent], { name: 'uiComponent' })
  findAll() {
    return this.uiComponentService.findAll();
  }

  @Query(() => UiComponent, { name: 'uiComponent' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.uiComponentService.findOne(id);
  }

  @Mutation(() => UiComponent)
  updateUiComponent(
    @Args('updateUiComponentInput')
    updateUiComponentInput: UpdateUiComponentInput,
  ) {
    return this.uiComponentService.update(
      updateUiComponentInput.id,
      updateUiComponentInput,
    );
  }

  @Mutation(() => UiComponent)
  removeUiComponent(@Args('id', { type: () => String }) id: string) {
    return this.uiComponentService.remove(id);
  }
}
