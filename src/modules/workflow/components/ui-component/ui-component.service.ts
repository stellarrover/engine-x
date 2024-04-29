import { Injectable } from '@nestjs/common';
import { CreateUiComponentInput } from './dto/create-ui-component.input';
import { UpdateUiComponentInput } from './dto/update-ui-component.input';
import { UiComponentRepository } from './ui-component.repository';

@Injectable()
export class UiComponentService {
  constructor(private repository: UiComponentRepository) {}

  async create(userId: string, input: CreateUiComponentInput) {
    const component = await this.repository.create(userId, input);

    // related operations ⬇
    await this.repository.refreshOutputs(component);
    // TODO - ...
  }

  findAll() {
    return `This action returns all uiComponent`;
  }

  findOne(id: string) {
    return `This action returns a #${id} uiComponent`;
  }

  update(id: string, updateUiComponentInput: UpdateUiComponentInput) {
    console.log('updateUiComponentInput', updateUiComponentInput);
    return `This action updates a #${id} uiComponent`;
  }

  remove(id: string) {
    return `This action removes a #${id} uiComponent`;
  }
}
