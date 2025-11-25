import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImoviePagination } from '../models/imovie-pagination';
import { IMovieDetails } from '../models/imovie-details';
import { IMovieByName } from '../models/imovie-by-name';
import { IMovieRecommendations } from '../models/imovie-recommendations';
import { IMovieByLang } from '../models/imovie-by-lang';
import { IVideoResponse } from '../models/ivideo';
import { IGenreResponse } from '../models/igenre';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _api= inject(HttpClient);
  private _langSvc = inject(LanguageService);
    private key ='c3bba90b5a6d52fe51d8ddeaaefd959c';
    private _baseUrl = 'https://api.themoviedb.org/3';

  // !---Pagination

  getPageById(page: number): Observable<ImoviePagination> {
    const lang = this._langSvc.getCurrentLanguage();
    return this._api.get<ImoviePagination>(
      `${this._baseUrl}/movie/popular?api_key=${this.key}&page=${page}&language=${lang}`
    );
  }
  //!---get by id
getMovieById(id: number): Observable<IMovieDetails> {
    const lang = this._langSvc.getCurrentLanguage();
    return this._api.get<IMovieDetails>(
      `${this._baseUrl}/movie/${id}?api_key=${this.key}&language=${lang}`
    );
  }
  //!---get by name
getMovieByName(name: string): Observable<IMovieByName> {
    const lang = this._langSvc.getCurrentLanguage();
    return this._api.get<IMovieByName>(
      `${this._baseUrl}/search/movie?api_key=${this.key}&query=${encodeURIComponent(
        name
      )}&language=${lang}`
    );
  }
  //!---get recommendations
getMovieRecommendation(id: number): Observable<IMovieRecommendations> {
    const lang = this._langSvc.getCurrentLanguage();
    return this._api.get<IMovieRecommendations>(
      `${this._baseUrl}/movie/${id}/recommendations?api_key=${this.key}&language=${lang}`
    );
  }

  //!---get videos for a movie
  getMovieVideos(id: number): Observable<IVideoResponse> {
    const lang = this._langSvc.getCurrentLanguage();
    return this._api.get<IVideoResponse>(
      `${this._baseUrl}/movie/${id}/videos?api_key=${this.key}&language=${lang}`
    );
  }

 //!---get by lang
getMovieByLang(lang: string): Observable<IMovieByLang> {
    return this._api.get<IMovieByLang>(
      `${this._baseUrl}/movie/now_playing?api_key=${this.key}&language=${lang}`
    );
  }

  //!---get genres
  getGenres(): Observable<IGenreResponse> {
    const lang = this._langSvc.getCurrentLanguage();
    return this._api.get<IGenreResponse>(
      `${this._baseUrl}/genre/movie/list?api_key=${this.key}&language=${lang}`
    );
  }

  //!---discover movies with filters (sorting, genres, rating)
  getDiscoverMovies(
    page: number = 1,
    sortBy: string = 'popularity.desc',
    genreIds?: number[],
    minRating?: number
  ): Observable<ImoviePagination> {
    const lang = this._langSvc.getCurrentLanguage();
    let url = `${this._baseUrl}/discover/movie?api_key=${this.key}&language=${lang}&page=${page}&sort_by=${sortBy}`;
    
    if (genreIds && genreIds.length > 0) {
      url += `&with_genres=${genreIds.join(',')}`;
    }
    
    if (minRating !== undefined && minRating > 0) {
      url += `&vote_average.gte=${minRating}`;
    }
    
    return this._api.get<ImoviePagination>(url);
  }

}






