export interface IMovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: null | ICollection;
  budget: number;
  genres: IGenre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: IProductionCompany[];
  production_countries: IProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: ISpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
export interface IGenre {
  id: number;
  name: string;
}
export interface ICollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}
export interface IProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}
export interface IProductionCountry {
  iso_3166_1: string;
  name: string;
}
export interface ISpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}
