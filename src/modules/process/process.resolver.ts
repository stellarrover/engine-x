import { Resolver } from '@nestjs/graphql';
import { ProcessService } from './process.service';

@Resolver()
export class ProcessResolver {
  constructor(private readonly processService: ProcessService) {}
}
