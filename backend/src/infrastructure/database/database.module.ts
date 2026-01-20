import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserOrmEntity } from './entities/user.orm-entity';
import { TypeOrmUserRepository } from './repositories/user.repository';
import { USER_REPOSITORY } from '../../core/ports/repositories/user.repository';
import { TripOrmEntity } from './entities/trip.orm-entity';

/**
 * Database Module
 * Configures TypeORM and provides repository implementations
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [UserOrmEntity, TripOrmEntity],
        synchronize: true, // Should be false in production
      }),
    }),
    TypeOrmModule.forFeature([UserOrmEntity, TripOrmEntity]),
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class DatabaseModule {}
