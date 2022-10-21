import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles.guards';

@Module({
  controllers: [ListingsController],
  providers: [
    ListingsService, 
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ]
})
export class ListingsModule {}
