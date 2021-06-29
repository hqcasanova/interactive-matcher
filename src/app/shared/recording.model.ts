export interface Recording {
  title: string;
  artist: string;
  duration: string;
  isrc: string;
  [key: string]: string;
}