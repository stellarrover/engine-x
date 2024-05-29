import { Resolver } from '@nestjs/graphql';
import { UserSettingsService } from './user-settings.service';

@Resolver()
export class UserSettingsResolver {
  constructor(private readonly userSettingsService: UserSettingsService) {}
}
