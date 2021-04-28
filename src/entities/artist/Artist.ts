import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany
} from 'typeorm';
import { Album } from '../album/Album';
import { Track } from '../track/Track';

@Entity()
export class Artist {
  @PrimaryColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('int8')
  age: number;

  @OneToMany((type) => Album, (album) => album.artist)
  albums: Album[];

  @OneToMany((type) => Track, (track) => track.artist)
  tracks: Track[];
}
