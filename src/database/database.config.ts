import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LocationEntity } from 'src/location/entities/location.entity';

const DatabaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: './src/database/IPs.sqlite',
  entities: [LocationEntity],
  synchronize: true,
};

export default DatabaseConfig;
