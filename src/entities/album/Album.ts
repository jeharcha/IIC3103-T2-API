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
  artist_url: string;

  @Column('text')
  tracks_url: string;

  @Column('text')
  self_url: string;

  @ManyToOne((type) => Artist, (artist) => artist.albums)
  artist: Artist;

  @OneToMany((type) => Track, (track) => track.album)
  tracks: Track[];

  @OneToOne((type) => Album)
  self: string;
}
