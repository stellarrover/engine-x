import { Injectable } from '@nestjs/common';
import { CreateUiComponentInput } from './dto/create-ui-component.input';
import { UpdateUiComponentInput } from './dto/update-ui-component.input';

@Injectable()
export class UiComponentService {
  create(createUiComponentInput: CreateUiComponentInput) {
    console.log('createUiComponentInput', createUiComponentInput);
    return 'This action adds a new uiComponent';
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
