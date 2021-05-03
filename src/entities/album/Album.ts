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
import { Track } from '../track/Track';

@Entity()
export class Album {
  @PrimaryColumn()
  id: string;

  @Column('text')
  artist_id: string;

  @Column('text')
  name: string;

  @Column('text')
  genre: string;

  @Column('text')
  artist: string;

  @Column('text')
  tracks: string;

  @Column('text')
  self: string;
}
