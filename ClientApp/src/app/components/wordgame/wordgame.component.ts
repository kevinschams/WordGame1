
// import { Component, OnInit } from '@angular/core';
// import { GameService } from '../../auth/services/gameService';
// import { GameDto } from '../../models/gameDto';
// import { Observable } from 'rxjs';
// // import { RouterModule } from '../../auth/auth.module';
// // import { CommonModule, NgFor } from '../../auth/auth.module';
// @Component({
//   selector: 'app-wordgame',
//   templateUrl: './wordgame.component.html',
//   styleUrls: ['./wordgame.component.css']
// })
// export class WordgameComponent implements OnInit {

//   public games: Observable<GameDto[]>;

//   constructor(private gameService: GameService) {
//     this.games = this.gameService.getAllGames();
//   }

//   ngOnInit(): void {
//     // No need to call loadGames() here as games are already loaded in the constructor
//   }

//   createNewGame(): void {
//     this.gameService.createNewGame().subscribe(
//       game => {
//         console.log('New game created: ', game);
//         // No need to reload games here as getAllGames() already returns an updated list
//       },
//       error => {
//         console.error('Error creating new game: ', error);
//       }
//     );
//   }

//   makeGuess(gameId: number, guess: string): void {
//     this.gameService.makeGuess(gameId, guess).subscribe(
//       updatedGame => {
//         console.log('Guess made: ', updatedGame);
//         // No need to reload games here as getAllGames() already returns an updated list
//       },
//       error => {
//         console.error('Error making guess: ', error);
//       }
//     );
//   }

//   deleteGame(gameId: number): void {
//     this.gameService.deleteGame(gameId).subscribe(
//       () => {
//         console.log('Game deleted');
//         // No need to reload games here as getAllGames() already returns an updated list
//       },
//       error => {
//         console.error('Error deleting game: ', error);
//       }
//     );
//   }

// }
import { Component, OnInit, inject } from '@angular/core';
import { GameService } from '../../auth/services/gameService';
import { GameDto } from '../../models/gameDto';
import { Observable, of } from 'rxjs';
import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-wordgame',
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule, AsyncPipe],
  templateUrl: './wordgame.component.html',
  styleUrl: './wordgame.component.css'
})
export class WordgameComponent implements OnInit{

  public games: Observable<GameDto[]>;

  constructor(private gameService: GameService) {
    this.games = this.gameService.getAllGames();
  }


  ngOnInit(): void {

  }

  createNewGame(): void {
    this.gameService.createNewGame().subscribe(
      game => {
        console.log('New game created: ', game);
        // No need to reload games here as getAllGames() already returns an updated list
      },
      error => {
        console.error('Error creating new game: ', error);
      }
    );
  }
    makeGuess(gameId: number, guess: string): void {
    this.gameService.makeGuess(gameId, guess).subscribe(
      updatedGame => {
        console.log('Guess made: ', updatedGame);
        // No need to reload games here as getAllGames() already returns an updated list
      },
      error => {
        console.error('Error making guess: ', error);
      }
    );
  }

  deleteGame(gameId: number): void {
    this.gameService.deleteGame(gameId).subscribe(
      () => {
        console.log('Game deleted');
        // No need to reload games here as getAllGames() already returns an updated list
      },
      error => {
        console.error('Error deleting game: ', error);
      }
    );
  }
  // loadGames(): void {
  //   this.gameService.getAllGames().subscribe(
  //     games => {
  //       this.games = games;
  //     },
  //     error => {
  //       console.error('Error loading games: ', error);
  //     }
  //   );
  // }



  // createNewGame(): void {
  //   this.gameService.createNewGame().subscribe(
  //     game => {
  //       console.log('New game created: ', game);
  //       this.loadGames(); // Reload games after creating a new one
  //     },
  //     error => {
  //       console.error('Error creating new game: ', error);
  //     }
  //   );
  // }

  // makeGuess(gameId: number, guess: string): void {
  //   this.gameService.makeGuess(gameId, guess).subscribe(
  //     updatedGame => {
  //       console.log('Guess made: ', updatedGame);
  //       this.loadGames(); // Reload games after making a guess
  //     },
  //     error => {
  //       console.error('Error making guess: ', error);
  //     }
  //   );
  // }

  // deleteGame(gameId: number): void {
  //   this.gameService.deleteGame(gameId).subscribe(
  //     () => {
  //       console.log('Game deleted');
  //       this.loadGames(); // Reload games after deleting one
  //     },
  //     error => {
  //       console.error('Error deleting game: ', error);
  //     }
  //   );
  // }

}

