import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { HttpExceptionFilter } from './presentation/filters/http-exception.filter';
import { ApiResponseInterceptor } from './presentation/interceptors/api-response.interceptor';
import { TripModule } from './modules/trip/trip.module';
import { VoyageModule } from './modules/voyage/voyage.module';
import { ChatModule } from './modules/chat/chat.module';
import { ReservationModule } from './modules/reservation/reservation.module';

/**
 * Application Root Module
 * Organizes the application following Clean Architecture principles
 */
@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Infrastructure
    DatabaseModule,
    // Feature modules
    AuthModule,
    UserModule,
    TripModule,
    VoyageModule,
    ChatModule,
    ReservationModule,
  ],
  providers: [
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // Global response interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
  ],
})
export class AppModule {}
