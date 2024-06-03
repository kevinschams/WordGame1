import { Component, NgModule, OnInit, inject } from '@angular/core';
import { GameService } from '../../auth/services/gameService';
import { GameDto } from '../../models/gameDto';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wordgame',
  templateUrl: './wordgame.component.html',
  styleUrls: ['./wordgame.component.css']
})
export class WordgameComponent implements OnInit {
  private _gameService = inject(GameService);

  public gameList$: Observable<GameDto[] | []> = this._gameService.currentGame$;

  
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getAllGames();
  }

  public getAllGames(): void{
    this._gameService.getAllGames();
  }

  createNewGame(): void {
    this._gameService.createNewGame().subscribe(
      game => {
        this.router.navigate(['/gameview/', game.gameId]);
      },
      error => {
        console.error('Error creating new game: ', error);
      }
    );
  }

  deleteGame(gameId: number): void {
    this._gameService.deleteGame(gameId).subscribe(
      () => {
        console.log('Game deleted');
        this.gameList$ = this.gameList$.pipe(
          map(games => games.filter(game => game.gameId !== gameId))
        );
      },
      error => {
        console.error('Error deleting game: ', error);
      }
    );
  }

  navigateToGame(gameId: number) {
    this.router.navigate(['/games', gameId.toString()]);
  }
  
}
@NgModule({
  declarations: [
    WordgameComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    WordgameComponent
  ]
})
export class GameViewModule { }


