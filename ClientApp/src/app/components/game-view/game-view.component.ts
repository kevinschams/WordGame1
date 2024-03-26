// import { NgModule, Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
// import { Observable, of, switchMap } from 'rxjs';
// import { GameDto } from '../../models/gameDto';
// import { GameService } from '../../auth/services/gameService';

// @Component({
//   selector: 'app-game-view',
//   templateUrl: './game-view.component.html',
//   styleUrls: ['./game-view.component.css']
// })
// export class GameViewComponent implements OnInit {

//   guessesRemaining: number = 8;
//   currentGuess: string = '';
//   currentGame: GameDto | null = null;


//   constructor(private gameService: GameService, private route: ActivatedRoute) {
    
//    }
//    ngOnInit(): void {
//     this.route.params.subscribe(params => {
//       const gameId = +params['id'];
//       if (gameId) {
//         this.gameService.getSingleGame(gameId).subscribe(
//           game => {
//             this.currentGame = game;
//             console.log(this.currentGame);
//           },
//           error => {
//             console.error('Error loading current game: ', error);
//           }
//         );
//       }
//     });
//   }


//   makeGuess(gameId: number): void {
//     this.gameService.makeGuess(gameId, this.currentGuess).subscribe(
//       updatedGame => {
//         console.log(this.currentGuess);
//         console.log('Guess made: ', updatedGame);
//         this.guessesRemaining--;
//         this.currentGuess = '';
//         updatedGame.guesses = this.guessesRemaining;
//         if(updatedGame.guesses == 0){
//           updatedGame.status = "Loss";
//         }
//       },
//       error => {
//         console.error('Error making guess: ', error);
//       }
//     );
//   }
  
// }

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
  currentGuess: string = '';
  public currentGame$: Observable<GameDto | null> = this._gameService.currentGame$;
  // currentGame$: Observable<GameDto | null>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.currentGame$ = this.route.params.pipe(
      switchMap(params => {
        const gameId = +params['id'];
        return gameId ? this._gameService.getSingleGame(gameId) : of(null);
      })
    )
  }

  makeGuess(gameId: number): void {
    this._gameService.makeGuess(gameId, this.currentGuess).subscribe(
      updatedGame => {
        console.log('Guess made: ', updatedGame);
        this.guessesRemaining--;
        this.currentGuess = '';
        updatedGame.guesses = this.guessesRemaining;
        if (updatedGame.guesses === 0) {
          updatedGame.status = 'Loss';
        }
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

