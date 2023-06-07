import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('IPs')
export class LocationEntity {
  @PrimaryColumn()
  ip: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  city: string;
}
