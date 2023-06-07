import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationEntity } from './entities/location.entity';
import { LocationRequest } from './interfaces/locationRequest.interface';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import { Location } from './interfaces/location.interface';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationEntity)
    private locationRepository: Repository<LocationEntity>,
  ) {}

  async findSqliteByIp(ip: string): Promise<LocationEntity | null> {
    return await this.locationRepository.findOneBy({
      ip,
    });
  }

  readJson(file: string): LocationRequest[] {
    const arrayFile = file.split('\n');
    const locations: LocationRequest[] = [];
    arrayFile.forEach((singleFile, index) => {
      if (arrayFile.length - 1 > index) {
        try {
          const location: LocationRequest = JSON.parse(singleFile);
          locations.push(location);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    });
    return locations;
  }

  async findCsvByIp(ip: string): Promise<Location | null> {
    const filePath = './src/assets/IPs.csv';

    return new Promise((resolve, reject) => {
      createReadStream(filePath)
        .pipe(parse())
        .on('data', (data: string[]) => {
          if (data[0] === ip) {
            resolve({
              ip: ip,
              latitude: Number(data[1]),
              longitude: Number(data[2]),
              country: data[3],
              state: data[4],
              city: data[5],
            });
          }
        })
        .on('end', () => {
          resolve(null);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  readCsv(file: string): Promise<LocationRequest[]> {
    return new Promise((resolve, reject) => {
      const locationRequests: LocationRequest[] = [];

      const parser = parse(file, { columns: true, skip_empty_lines: true });

      parser
        .on('readable', () => {
          let record;
          while ((record = parser.read())) {
            locationRequests.push({
              id: record.id,
              ip: record.ip,
              timestamp: Number(record.timestamp),
            });
          }
        })
        .on('error', (err: any) => {
          reject(err);
        })
        .on('end', () => {
          resolve(locationRequests);
        });
    });
  }
}
