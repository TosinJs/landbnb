import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ListingsModule } from './listings/listings.module';

@Module({
  imports: [UsersModule, ListingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
