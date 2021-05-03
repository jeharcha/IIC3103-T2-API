import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne
} from 'typeorm';
import { Artist } from '../artist/Artist';
import { Album } from '../album/Album';
import { type } from 'os';

@Entity()
export class Track {
  @PrimaryColumn()
  id: string;

  @Column('text')
  album_id: string;

  @Column('text')
  artist_id: string;

  @Column('text')
  name: string;

  @Column('float')
  duration: number;

  @Column('int')
  times_played: number;

  @Column('text')
  artist: string;

  @Column('text')
  album: string;

  @Column('text')
  self: string;
}
