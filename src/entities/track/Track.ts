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

  @ManyToOne((type) => Album, (album) => album.tracks)
  album_id: string;

  @Column('text')
  name: string;

  @Column()
  duration: number;

  @Column('int')
  times_played: number;

  @ManyToOne((type) => Artist, (artist) => artist.tracks)
  artist: Artist;

  @ManyToOne((type) => Album, (album) => album.tracks)
  album: Album;

  @OneToOne((type) => Track)
  self: string;
}
