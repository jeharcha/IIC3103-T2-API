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

  @ManyToOne((type) => Artist, (artist) => artist.albums)
  artist_id: string;

  @Column('text')
  name: string;

  @Column('text')
  genre: string;

  @ManyToOne((type) => Artist, (artist) => artist.albums)
  artist: Artist;

  @OneToMany((type) => Track, (track) => track.album)
  tracks: Track[];

  @OneToOne((type) => Album)
  self: string;
}
