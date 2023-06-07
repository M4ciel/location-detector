import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { LocationService } from './location.service';
import { LocationEntity } from './entities/location.entity';
import { LocationRequest } from './interfaces/locationRequest.interface';

describe('LocationService', () => {
  let locationService: LocationService;
  let locationRepository: Repository<LocationEntity>;

  beforeEach(() => {
    const entityManagerMock: EntityManager = {} as EntityManager; // Replace with your own EntityManager mock
    const queryRunnerMock: QueryRunner = {} as QueryRunner;

    locationRepository = new Repository<LocationEntity>(
      LocationEntity,
      entityManagerMock,
      queryRunnerMock,
    );
    locationService = new LocationService(locationRepository); // Pass any necessary dependencies
  });

  describe('findSqliteByIp', () => {
    it('should return null if IP is not found in the SQLite database', async () => {
      locationRepository.findOneBy = jest.fn().mockResolvedValue(null);

      const ip = '127.0.0.1';
      const result = await locationService.findSqliteByIp(ip);

      expect(result).toBeNull();
    });

    it('should return a LocationEntity if IP is found in the SQLite database', async () => {
      const mockLocationEntity = {
        // Create a mock LocationEntity object
        ip: '127.0.0.1',
        // Add other necessary properties
      };

      locationRepository.findOneBy = jest
        .fn()
        .mockResolvedValue(mockLocationEntity);

      const ip = '127.0.0.1';
      const result = await locationService.findSqliteByIp(ip);

      expect(result).toEqual(mockLocationEntity);
    });
  });

  describe('readJson', () => {
    it('should parse the file and return an array of LocationRequest objects', () => {
      const file =
        '{"id": "1", "ip": "127.0.0.1", "timestamp": 123456789}\n' +
        '{"id": "2", "ip": "192.168.0.1", "timestamp": 987654321}';

      const expected: LocationRequest[] = [
        { id: '1', ip: '127.0.0.1', timestamp: 123456789 },
        { id: '2', ip: '192.168.0.1', timestamp: 987654321 },
      ];

      const result: LocationRequest[] = locationService.readJson(file);

      console.log(result);

      expect(result).toEqual(expected);
    });

    it('should handle JSON parsing errors and log the error', () => {
      const file =
        '{"id": "1", "ip": "127.0.0.1", "timestamp": 123456789}\n' +
        '{"id": "2", "ip": "192.168.0.1", "timestamp": "invalid"}';

      const consoleErrorSpy = jest.spyOn(console, 'error');

      const result = locationService.readJson(file);

      expect(result).toHaveLength(1);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('findCsvByIp', () => {
    // it('should return null if IP is not found in the CSV file', async () => {
    //   jest.spyOn(locationService, 'createReadStream').mockReturnValue({
    //     pipe: jest.fn().mockReturnThis(),
    //     on: jest.fn((event: string, callback: any) => {
    //       if (event === 'end') {
    //         callback();
    //       }
    //     }),
    //   } as any);
    //   const ip = '127.0.0.1';
    //   const result = await locationService.findCsvByIp(ip);
    //   expect(result).toBeNull();
    // });
    // it('should return a Location object if IP is found in the CSV file', async () => {
    //   const mockLocation = {
    //     ip: '127.0.0.1',
    //     // Add other necessary properties
    //   };
    //   // Mock the createReadStream and parse methods to simulate reading the CSV file
    //   jest.spyOn(locationService, 'createReadStream').mockReturnValue({
    //     pipe: jest.fn().mockReturnThis(),
    //     on: jest.fn((event: string, callback: any) => {
    //       if (event === 'data') {
    //         callback([
    //           mockLocation.ip,
    //           '123.456',
    //           '789.012',
    //           'Country',
    //           'State',
    //           'City',
    //         ]);
    //       } else if (event === 'end') {
    //         callback();
    //       }
    //     }),
    //   } as any);
    //   const ip = '127.0.0.1';
    //   const result = await locationService.findCsvByIp(ip);
    //   expect(result).toEqual(mockLocation);
    // });
  });

  // Add more test cases as needed for other methods
});
