import { Injectable } from '@nestjs/common';
import { LocationService } from './location/location.service';
import { LocationResponse } from './location/interfaces/locationResponse.interface';
import { createWriteStream, statSync } from 'fs';
import { join } from 'path';
import { readdir, unlink } from 'fs/promises';

@Injectable()
export class AppService extends LocationService {
  async findByJson(file: string) {
    const locationRequest = await this.readJson(file);
    const filePath = await this.alocateStoreage('jsonl');
    const writer = createWriteStream(filePath);

    for (const loc of locationRequest) {
      const data = await this.findSqliteByIp(loc.ip);
      if (data) {
        const newLocation: LocationResponse = {
          timestamp: loc.timestamp,
          ip: loc.ip,
          id: loc.id,
          latitude: data.latitude,
          longitude: data.longitude,
          country: data.country,
          state: data.state,
          city: data.city,
        };

        writer.write(JSON.stringify(newLocation) + '\n');
      }
    }

    return new Promise<string>((resolve, reject) => {
      writer.on('finish', () => resolve(filePath));
      writer.on('error', reject);
      writer.end();
    });
  }

  async findByCsv(file: string) {
    const locationRequest = await this.readCsv(file);
    const filePath = await this.alocateStoreage('csv');
    const writer = createWriteStream(filePath);

    for (const loc of locationRequest) {
      const data = await this.findCsvByIp(loc.ip);
      if (data) {
        const newLocation: LocationResponse = {
          timestamp: loc.timestamp,
          ip: loc.ip,
          id: loc.id,
          latitude: data.latitude,
          longitude: data.longitude,
          country: data.country,
          state: data.state,
          city: data.city,
        };

        writer.write(JSON.stringify(newLocation) + '\n');
      }
    }

    return new Promise<string>((resolve, reject) => {
      writer.on('finish', () => resolve(filePath));
      writer.on('error', reject);
      writer.end();
    });
  }

  private async alocateStoreage(extName: 'jsonl' | 'csv'): Promise<string> {
    const folderPath = join(process.cwd(), `./src/assets/uploads/${extName}/`);
    const files = await readdir(folderPath);

    if (files.length >= 10) {
      files.sort((a, b) => {
        const aPath = join(folderPath, a);
        const bPath = join(folderPath, b);
        return (
          new Date(statSync(aPath).mtime).getTime() -
          new Date(statSync(bPath).mtime).getTime()
        );
      });

      await unlink(join(folderPath, files[0]));
    }

    const filePath = join(folderPath, `${Date.now().toString()}.${extName}`);

    return filePath;
  }
}
