import { Injectable } from '@nestjs/common';
import { CreateAiComponentInput } from './dto/create-ai-component.input';
import { UpdateAiComponentInput } from './dto/update-ai-component.input';

@Injectable()
export class AiComponentService {
  create(createAiComponentInput: CreateAiComponentInput) {
    return 'This action adds a new aiComponent';
  }

  findAll() {
    return `This action returns all aiComponent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aiComponent`;
  }

  update(id: number, updateAiComponentInput: UpdateAiComponentInput) {
    return `This action updates a #${id} aiComponent`;
  }

  remove(id: number) {
    return `This action removes a #${id} aiComponent`;
  }
}
