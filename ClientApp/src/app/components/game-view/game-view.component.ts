import { Component, NgModule, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GameDto } from '../../models/gameDto';
import { GameService } from '../../auth/services/gameService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {

  private _gameService = inject(GameService);

  guessesRemaining: number = 8;
  
  currentGuess: string = '';

  public currentGame$: Observable<GameDto | null> = of(null);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getSingleGame();
  }
  
  public getSingleGame(): void {
    this.route.params.pipe(
      switchMap(params => {
        const gameId = +params['id'];
        return gameId ? this._gameService.getSingleGame(gameId) : of(null);
      })
    ).subscribe(game => {
      this.currentGame$ = of(game);
    });
  }

  makeGuess(gameId: number): void {
    this._gameService.makeGuess(gameId, this.currentGuess).subscribe(
      updatedGame => {
        console.log('Guess made: ', updatedGame);
        this.guessesRemaining--;
        this.currentGuess = '';
        updatedGame.remainingGuesses = this.guessesRemaining;

        if (updatedGame.remainingGuesses === 0) {
          updatedGame.status = 'Loss';
        }

        this.currentGame$ = of(updatedGame);
      },
      error => {
        console.error('Error making guess: ', error);
      }
    );
  }

  goBackToGameList() {
    this.router.navigate(['/wordgame']); // Replace '/game-list' with the actual route you want to navigate to
  }
}

@NgModule({
  declarations: [
    GameViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    GameViewComponent
  ]
})
export class GameViewModule { }

