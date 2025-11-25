import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { ImoviePagination } from '../models/imovie-pagination';
import { Observable, of } from 'rxjs';
import { IMovieDetails } from '../models/imovie-details';
import { IMovieByName } from '../models/imovie-by-name';
import { IMovieRecommendations } from '../models/imovie-recommendations';
import { IMovieByLang } from '../models/imovie-by-lang';
import { IVideoResponse } from '../models/ivideo';
import { IGenreResponse } from '../models/igenre';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private api: ApiService) {
    this.moviePagination$= this.api.getPageById(1);
    this.movieDetails$ = this.api.getMovieById(2);
    this.AllMovieByName$ = this.api.getMovieByName("Ariel");
    this.MovieRecommendation$=this.api.getMovieRecommendation(2);
    this.AllMovieByLang$=this.api.getMovieByLang("ar");
  }
  // simple genres observable to satisfy templates that expect movies.genres$
  genres$: Observable<IGenreResponse> = of({ genres: [] });
  //!--moviePagination---
moviePagination$ :Observable<ImoviePagination>;
setPagination(pageId:number){
  this.moviePagination$= this.api.getPageById(pageId);
}
  // Compatibility aliases used by components
  // nowPlaying$ maps to moviePagination$
  get nowPlaying$(): Observable<ImoviePagination> {
    return this.moviePagination$;
  }

  // Public method expected by other components. Language param is accepted but not used by current ApiService pagination.
  setNowPlayingWithLanguage(page: number, _lang?: string) {
    this.setPagination(page);
  }
//!----movieDetails------
movieDetails$ :Observable<IMovieDetails>;
setmovieDetails(Id:number){
  this.movieDetails$= this.api.getMovieById(Id);
}
//!----search by name------
AllMovieByName$ :Observable<IMovieByName>;
setAllMovieByName(name:string){
  this.AllMovieByName$= this.api.getMovieByName(name);
}
//!----get recommendation------
MovieRecommendation$ :Observable<IMovieRecommendations>;
setMovieRecommendation(Id:number){
  this.MovieRecommendation$= this.api.getMovieRecommendation(Id);
}
  
  /**
   * Return an observable of videos for a movie (trailers)
   */
  getMovieVideos(id: number) {
    return this.api.getMovieVideos(id);
  }
//!----get recommendation------
AllMovieByLang$ :Observable<IMovieByLang>;
setAllMovieByLang(lang:string){
  this.AllMovieByLang$= this.api.getMovieByLang(lang);
}

  // Discovery / filtered movies compatibility
  // Now properly uses ApiService.getDiscoverMovies with filters
  filteredMovies$!: Observable<ImoviePagination>;
  setDiscoverMovies(
    page: number = 1,
    _lang?: string,
    sortBy: string = 'popularity.desc',
    genres?: number[] | undefined,
    minRating?: number | undefined
  ) {
    this.filteredMovies$ = this.api.getDiscoverMovies(page, sortBy, genres, minRating);
  }

  /**
   * Fetch genres list from TMDB
   */
  getGenres(): Observable<IGenreResponse> {
    return this.api.getGenres();
  }

  /**
   * Update genres observable (typically called on app init or language change)
   */
  loadGenres() {
    this.genres$ = this.api.getGenres();
  }

}
