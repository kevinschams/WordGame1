import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GameDto } from '../../models/gameDto';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private _http = inject(HttpClient);
  private currentGameSubject: BehaviorSubject<GameDto[] | []> = new BehaviorSubject<GameDto[] | []>([] as GameDto[]);

  public currentGame$: Observable<GameDto[] | []> = this.currentGameSubject.asObservable();
  
  constructor() { }

  public getAllGames(): void {
    this._http.get<GameDto[]>(`/api/GamePlay`).subscribe(showList => {
      this.currentGameSubject.next(showList);
    });
  }


  public getSingleGame(gameId: number): Observable<GameDto> {
    return this._http.get<GameDto>(`/api/GamePlay/${gameId}`).pipe(
      tap(singleGame => {
        this.currentGameSubject.next([singleGame]);
      })
    );
  }

  public createNewGame(): Observable<GameDto> {
    return this._http.post<GameDto>('/api/GamePlay', {}).pipe(
      tap(newGame => this.setCurrentGame(newGame))
    );
  }

  public makeGuess(gameId: number, guess: string): Observable<GameDto> {
    return this._http.post<GameDto>(`/api/GamePlay/${gameId}/guesses?guess=${guess}`, {}).pipe(
      tap(updatedGame => this.setCurrentGame(updatedGame))
    );
  }

  public deleteGame(gameId: number): Observable<any> {
    return this._http.delete(`/api/GamePlay/${gameId}`);
  }

  private setCurrentGame(game: GameDto): void {
    this.currentGameSubject.next([game]);
  }
}

