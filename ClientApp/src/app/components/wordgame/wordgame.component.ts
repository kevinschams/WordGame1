import { Component, OnInit, inject } from '@angular/core';
import { GameService } from '../../auth/services/gameService';
import { GameDto } from '../../models/gameDto';
import { Observable, of } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-wordgame',
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule],
  templateUrl: './wordgame.component.html',
  styleUrl: './wordgame.component.css'
})
export class WordgameComponent implements OnInit{

  games: GameDto[] = [];

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

  makeGuess(gameId: number, guess: string): void {
    this.gameService.makeGuess(gameId, guess).subscribe(
      updatedGame => {
        console.log('Guess made: ', updatedGame);
        this.loadGames(); // Reload games after making a guess
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

}

