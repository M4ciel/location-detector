import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocationService } from './location/location.service';
import { LocationEntity } from './location/entities/location.entity';
import DatabaseConfig from './database/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(DatabaseConfig),
    TypeOrmModule.forFeature([LocationEntity]),
  ],
  controllers: [AppController],
  providers: [AppService, LocationService],
})
export class AppModule {}
