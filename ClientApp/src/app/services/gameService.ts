import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameDto } from '../models/gameDto';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  getAllGames(): Observable<GameDto[]> {
    return this.http.get<GameDto[]>('/api/gameplay');
  }

  getSingleGame(gameId: number): Observable<GameDto> {
    return this.http.get<GameDto>(`/api/gameplay/${gameId}`);
  }

  createNewGame(): Observable<GameDto> {
    return this.http.post<GameDto>('/api/gameplay', {});
  }

  makeGuess(gameId: number, guess: string): Observable<GameDto> {
    return this.http.post<GameDto>(`/api/gameplay/${gameId}/guesses?guess=${guess}`, {});
  }

  deleteGame(gameId: number): Observable<any> {
    return this.http.delete(`/api/gameplay/${gameId}`);
  }
}
