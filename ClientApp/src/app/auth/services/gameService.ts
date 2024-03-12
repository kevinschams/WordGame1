import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameDto } from '../../models/gameDto';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private _http: HttpClient) { }

  getAllGames(): Observable<GameDto[]> {
    return this._http.get<GameDto[]>('/api/gameplay');
  }

  getSingleGame(gameId: number): Observable<GameDto> {
    return this._http.get<GameDto>(`/api/gameplay/${gameId}`);
  }

  createNewGame(): Observable<GameDto> {
    return this._http.post<GameDto>('/api/gameplay', {});
  }

  makeGuess(gameId: number, guess: string): Observable<GameDto> {
    return this._http.post<GameDto>(`/api/gameplay/${gameId}/guesses?guess=${guess}`, {});
  }

  deleteGame(gameId: number): Observable<any> {
    return this._http.delete(`/api/gameplay/${gameId}`);
  }
}

