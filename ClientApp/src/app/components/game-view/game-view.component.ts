import { NgModule, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { GameDto } from '../../models/gameDto';
import { GameService } from '../../auth/services/gameService';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {

  currentGame$!: Observable<GameDto | null>;
  guessesRemaining: number = 8;
  currentGuess: string = '';
  public games$: Observable<GameDto[]>;

  constructor(private gameService: GameService, private route: ActivatedRoute) {
    this.games$ = this.gameService.getAllGames();
   }

  ngOnInit(): void {
    this.currentGame$ = this.route.params.pipe(
      switchMap(params => {
        const gameId = +params['id']; 
        console.log(gameId);
        return gameId ? this.gameService.getSingleGame(gameId) : of(null);
      })
    );
  }

  makeGuess(gameId: number): void {
    this.gameService.makeGuess(gameId, this.currentGuess).subscribe(
      updatedGame => {
        console.log(this.currentGuess);
        console.log('Guess made: ', updatedGame);
        this.guessesRemaining--;
        if (this.guessesRemaining === 0) {
          this.updateGameStatus(gameId, 'Loss');
        }
        this.currentGuess = '';
      },
      error => {
        console.error('Error making guess: ', error);
      }
    );
  }

  private updateGameStatus(gameId: number, status: string): void {
    // You can choose to update the game status in your backend as well

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


// import { Component, OnInit } from '@angular/core';
// import { GameDto } from '../../models/gameDto';
// import { GameService } from '../../auth/services/gameService';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';


// @Component({
//   selector: 'app-game-view',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './game-view.component.html',
//   styleUrl: './game-view.component.css'
// })
// export class GameViewComponent implements OnInit {

//   games: GameDto[] = [];
//   guessesRemaining: number = 8; // Initial guesses remaining
//   currentGuess: string = '';
//   correctGuesses: string[] = [];
//   currentGame: GameDto | null = null; // Holds the current game

//   constructor(    private gameService: GameService,
//     private route: ActivatedRoute) { }

//   // ngOnInit(): void {
//   //   this.loadGames();
//   // }
//   ngOnInit(): void {
//     // Extract game ID from URL parameters
//     this.route.params.subscribe(params => {
//       const gameId = +params['id'];
//       if (gameId) {
//         // Fetch the current game based on the ID
//         this.gameService.getSingleGame(gameId).subscribe(
//           game => {
//             this.currentGame = game;
//           },
//           error => {
//             console.error('Error loading current game: ', error);
//           }
//         );
//       }
//     });
//   }

//   loadGames(): void {
//     this.gameService.getAllGames().subscribe(
//       games => {
//         this.games = games;

//       },
//       error => {
//         console.error('Error loading games: ', error);
//       }
//     );
//   }



//   makeGuess(gameId: number): void {
//     this.gameService.makeGuess(gameId, this.currentGuess).subscribe(
//       updatedGame => {
//         console.log('Guess made: ', updatedGame);
//         // Check if the guess is correct and update correctGuesses array
//         // You need to implement this logic based on your application requirements
//         // For this example, let's assume if the guess is correct, we add it to correctGuesses array
//         // if (this.currentGuess === updatedGame.correctGuess) {
//         //   this.correctGuesses.push(this.currentGuess);
//         // }


//         // Reduce guesses remaininge
//         this.guessesRemaining--;
//         if (this.guessesRemaining === 0) {
//           // Update game status to loss
//           this.updateGameStatus(gameId, 'Loss');
//         }
//         // Reset currentGuess
//         this.currentGuess = '';
//         // Reload games after making a guessAbov
//         // this.loadGames();
//       },
//       error => {
//         console.error('Error making guess: ', error);
//       }
//     );
//   }

//   private updateGameStatus(gameId: number, status: string): void {
//     // Find the game by ID and update its status
//     const gameToUpdate = this.games.find(game => game.gameId === gameId);
//     if (gameToUpdate) {
//       gameToUpdate.status = status;
//     }
//   }

// }
