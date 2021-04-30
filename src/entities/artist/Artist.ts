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

  @OneToMany((type) => Album, (album) => album.artist)
  albums: Album[];

  @OneToMany((type) => Track, (track) => track.artist)
  tracks: Track[];

  @OneToOne((type) => Artist)
  self: string;
}
