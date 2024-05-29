import { Resolver } from '@nestjs/graphql';
import { ThumbsService } from './thumbs.service';

@Resolver()
export class ThumbsResolver {
  constructor(private readonly thumbsService: ThumbsService) {}
}
