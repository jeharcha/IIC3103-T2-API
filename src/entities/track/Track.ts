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
  artist_url: string;

  @Column('text')
  album_url: string;

  @Column('text')
  self_url: string;

  @ManyToOne((type) => Artist, (artist) => artist.tracks)
  artist: Artist;

  @ManyToOne((type) => Album, (album) => album.tracks)
  album: Album;

  @OneToOne((type) => Track)
  self: string;
}
