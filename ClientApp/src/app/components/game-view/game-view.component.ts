// import { Component, EventEmitter, NgModule, OnInit, inject } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Observable, Subscription, of } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
// import { GameDto } from '../../models/gameDto';
// import { GameService } from '../../auth/services/gameService';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-game-view',
//   templateUrl: './game-view.component.html',
//   styleUrls: ['./game-view.component.css']
// })
// export class GameViewComponent implements OnInit {

//   private _gameService = inject(GameService);

//   guessesRemaining: number = 8;
  
//   currentGuess: string = '';


//   public currentGame$: Observable<GameDto[] | []> = this._gameService.currentGame$;
//   // currentGame$: Observable<GameDto | null>;


//   constructor(private route: ActivatedRoute) {}

//   ngOnInit(): void {
//     this.getSingleGame();
//   }
  
//   public getSingleGame(): void{
//     this.route.params.pipe(
//       switchMap(params => {
//         const gameId = +params['id'];
//         console.log(this._gameService.getSingleGame(gameId));
//         return gameId ? this._gameService.getSingleGame(gameId) : of([]);
//       })
//     )
//     // this._gameService.getSingleGame();
//   }

//   makeGuess(gameId: number): void {
//     this._gameService.makeGuess(gameId, this.currentGuess).subscribe(
//       updatedGame => {
//         console.log('Guess made: ', updatedGame);
//         this.guessesRemaining--;
//         this.currentGuess = '';

//         updatedGame.guesses = this.guessesRemaining;
//         // updatedGame.status = this.status;
        
//         if (updatedGame.guesses === 0) {
//           updatedGame.status = 'Loss';
//         }
//         // Update currentGame$ observable with the updated game
//         // this.currentGame$ = of(updatedGame);

//         this.currentGame$.subscribe(game => {
//           console.log(game);
//         })
        
//         // console.log(this.currentGame$);
//       },
//       error => {
//         console.error('Error making guess: ', error);
//       }
//     );
//   }
// }



// @NgModule({
//   declarations: [
//     GameViewComponent
//   ],
//   imports: [
//     CommonModule,
//     FormsModule
//   ],
//   exports: [
//     GameViewComponent
//   ]
// })
// export class GameViewModule { }
import { Component, NgModule, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  // endTarget: string = '';
  
  currentGuess: string = '';

  // Change the type of currentGame$ to Observable<GameDto | null>
  public currentGame$: Observable<GameDto | null> = of(null);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getSingleGame();
  }
  
  public getSingleGame(): void {
    this.route.params.pipe(
      switchMap(params => {
        const gameId = +params['id'];
        return gameId ? this._gameService.getSingleGame(gameId) : of(null); // Return null if gameId is falsy
      })
    ).subscribe(game => {
      // Set currentGame$ with the emitted game
      this.currentGame$ = of(game);
    });
  }

  makeGuess(gameId: number): void {
    this._gameService.makeGuess(gameId, this.currentGuess).subscribe(
      updatedGame => {
        console.log('Guess made: ', updatedGame);
        this.guessesRemaining--;
        this.currentGuess = '';
        // console.log(updatedGame.g)
        // updatedGame.remainingGuesses--;
        
        // this.guessesRemaining = updatedGame.remainingGuesses;
        console.log(updatedGame.target);
        // this.endTarget = updatedGame.target;
        updatedGame.guesses = this.guessesRemaining;
        // console.log(updatedGame.remainingGuesses);
        // console.log(updatedGame.guesses);
        // console.log(this.guessesRemaining);

        if (updatedGame.guesses === 0) {
          updatedGame.status = 'Loss';
        }

        // Update currentGame$ observable with the updated game
        this.currentGame$ = of(updatedGame);
      },
      error => {
        console.error('Error making guess: ', error);
      }
    );
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

