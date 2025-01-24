import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/services/prisma';

@Injectable()
export class ProcessStructureFactory {
  constructor(private readonly prisma: PrismaService) {}
}
