import { Resolver } from '@nestjs/graphql';
import { ProcessLabelService } from './process-label.service';

@Resolver()
export class ProcessLabelResolver {
  constructor(private readonly processLabelService: ProcessLabelService) {}
}
