import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ListingsModule } from './listings/listings.module';
import { verifyAccessToken, verifyIdToken } from './authman/authman.middleware';

@Module({
  imports: [UsersModule, ListingsModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(verifyIdToken)
    .forRoutes(
      {path: "listings", method: RequestMethod.GET}
      )
    consumer
    .apply(verifyAccessToken)
    .forRoutes(
      {path: "listings/profile", method: RequestMethod.GET},
      {path: "listings/profile/rentals", method: RequestMethod.GET},
      {path: "listings/profile", method: RequestMethod.GET},
      {path: "listings/:id", method: RequestMethod.PATCH},
      {path: "listings/:id", method: RequestMethod.DELETE},
      {path: "listings/rent/:id", method: RequestMethod.POST},
      {path: "listings/reviews/:id", method: RequestMethod.POST},
      )
  }
}
