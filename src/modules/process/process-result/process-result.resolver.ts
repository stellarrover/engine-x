import { Resolver } from '@nestjs/graphql';
import { ProcessResultService } from './process-result.service';

@Resolver()
export class ProcessResultResolver {
  constructor(private readonly processResultService: ProcessResultService) {}
}
