import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Artist } from '../artist/Artist';
import { Album } from '../album/Album';

@Entity()
export class Track {
  @PrimaryColumn()
  id: number;

  @ManyToOne((type) => Album, (album) => album.tracks)
  album_id: string;

  @Column('text')
  name: string;

  @Column()
  duration: number;

  @Column('int64')
  times_played: number;

  @ManyToOne((type) => Artist, (artist) => artist.tracks)
  artist: Artist;

  @ManyToOne((type) => Album, (album) => album.tracks)
  album: Album;

  @Column()
  self: string;
}
