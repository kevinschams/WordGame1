import { Component, OnInit } from '@angular/core';
import { GameDto } from '../../models/gameDto';
import { GameService } from '../../auth/services/gameService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-game-view',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './game-view.component.html',
  styleUrl: './game-view.component.css'
})
export class GameViewComponent implements OnInit {

  games: GameDto[] = [];
  guessesRemaining: number = 8; // Initial guesses remaining
  currentGuess: string = '';
  correctGuesses: string[] = [];

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getAllGames().subscribe(
      games => {
        this.games = games;
      },
      error => {
        console.error('Error loading games: ', error);
      }
    );
  }

  createNewGame(): void {
    this.gameService.createNewGame().subscribe(
      game => {
        console.log('New game created: ', game);
        this.loadGames(); // Reload games after creating a new one
      },
      error => {
        console.error('Error creating new game: ', error);
      }
    );
  }

  makeGuess(gameId: number): void {
    this.gameService.makeGuess(gameId, this.currentGuess).subscribe(
      updatedGame => {
        console.log('Guess made: ', updatedGame);
        // Check if the guess is correct and update correctGuesses array
        // You need to implement this logic based on your application requirements
        // For this example, let's assume if the guess is correct, we add it to correctGuesses array
        // if (this.currentGuess === updatedGame.correctGuess) {
        //   this.correctGuesses.push(this.currentGuess);
        // }


        // Reduce guesses remaining
        this.guessesRemaining--;
        // Reset currentGuess
        this.currentGuess = '';
        // Reload games after making a guess
        this.loadGames();
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
        this.loadGames(); // Reload games after deleting one
      },
      error => {
        console.error('Error deleting game: ', error);
      }
    );
  }

}{

}
