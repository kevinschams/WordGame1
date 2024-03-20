import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { GameDto } from '../../models/gameDto';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentGameSubject: BehaviorSubject<GameDto | null> = new BehaviorSubject<GameDto | null>(null);

  constructor(private _http: HttpClient) { }

  getCurrentGame(): Observable<GameDto | null> {
    return this.currentGameSubject.asObservable();
  }

  setCurrentGame(game: GameDto): void {
    this.currentGameSubject.next(game);
  }

  

  public getAllGames(): Observable<GameDto[]> {
    return this._http.get<GameDto[]>('/api/GamePlay');
  }

  public getSingleGame(gameId: number): Observable<GameDto> {
    return this._http.get<GameDto>(`/api/GamePlay/${gameId}`);
  }

  public createNewGame(): Observable<GameDto> {
    return this._http.post<GameDto>('/api/GamePlay', {});
  }

  public makeGuess(gameId: number, guess: string): Observable<GameDto> {
    return this._http.post<GameDto>(`/api/GamePlay/${gameId}/guesses?guess=${guess}`, {});
  }
//   public makeGuess(gameId: number, guess: string): Observable<GameDto> {
//   const url = `/api/GamePlay/${gameId}/guesses?guess=${guess}`;
//   return this._http.post<GameDto>(url, {}).pipe(
//     tap(updatedGame => {
//       this.setCurrentGame(updatedGame); // Update current game after making guess
//     })
//   );
// }


  public deleteGame(gameId: number): Observable<any> {
    return this._http.delete(`/api/GamePlay/${gameId}`);
  }

}
