export interface Movie {
  cinemaName: string;
  id: number;
  title: string;
  imageUrl: string;
  imageBanner?: string;
  format?: 'DOB' | 'SUB';
  externalUrl?: string;
  duration?: string;
  rating?: string;
  genre?: string;
  synopsis?: string;
  trailerId?: string;
  transcript?: string;
  releaseDate?: string;
}
