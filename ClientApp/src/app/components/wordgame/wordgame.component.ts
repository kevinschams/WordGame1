import { Component, OnInit, inject } from '@angular/core';
import { GameService } from '../../auth/services/gameService';
import { GameDto } from '../../models/gameDto';
import { Observable, of } from 'rxjs';
import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-wordgame',
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule, AsyncPipe],
  templateUrl: './wordgame.component.html',
  styleUrl: './wordgame.component.css'
})
export class WordgameComponent implements OnInit{

  public games: Observable<GameDto[]>;


  constructor(private gameService: GameService, private router: Router) {
    this.games = this.gameService.getAllGames();
  }


  ngOnInit(): void {

  }

  createNewGame(): void {
    this.gameService.createNewGame().subscribe(
      game => {
        console.log('New game created: ', game);
        this.router.navigate(['/gameview/', game.gameId]);
        // No need to reload games here as getAllGames() already returns an updated list
      },
      error => {
        console.error('Error creating new game: ', error);
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



}

