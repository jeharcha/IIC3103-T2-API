import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Artist } from '../artist/Artist';
import { Track } from '../track/Track';

@Entity()
export class Album {
  @PrimaryColumn()
  id: number;

  @ManyToOne((type) => Artist, (artist) => artist.albums)
  artist_id: number;

  @Column('text')
  name: string;

  @Column('text')
  genre: string;

  @ManyToOne((type) => Artist, (artist) => artist.albums)
  artist: Artist;

  @OneToMany((type) => Track, (track) => track.album)
  tracks: Track[];

  @Column()
  self: string;
}
