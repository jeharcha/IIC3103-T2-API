import { type } from 'os';
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  OneToOne
} from 'typeorm';
import { Album } from '../album/Album';
import { Track } from '../track/Track';

@Entity()
export class Artist {
  @PrimaryColumn()
  id: string;

  @Column('text')
  name: string;

  @Column('int')
  age: number;

  @Column('text')
  albums: string;

  @Column('text')
  tracks: string;

  @Column('text')
  self: string;
}
