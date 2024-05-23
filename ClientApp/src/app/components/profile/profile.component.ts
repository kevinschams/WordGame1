import { Component, NgModule, OnInit, inject } from '@angular/core';
import { GameService } from '../../auth/services/gameService';
import { GameDto } from '../../models/gameDto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import the map operator
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  private _gameService = inject(GameService); 
  public gameList$: Observable<GameDto[]> = this._gameService.currentGame$; // Remove the | [] type

  public wonGames$: Observable<GameDto[]> = new Observable<GameDto[]>();; // Observable for won games
  public lostGames$: Observable<GameDto[]> = new Observable<GameDto[]>();; // Observable for lost games
  public unfinishedGames$: Observable<GameDto[]> = new Observable<GameDto[]>();; // Observable for unfinished games

    // Chart data
  public chartData: number[] = [];
  public chartLabels: string[] = ['Won', 'Lost', 'Unfinished'];
  

  public getAllGames(): void{
    this._gameService.getAllGames();
  }

  ngOnInit(): void {
    this.getAllGames();
    this.filterGames(); // Call the method to filter games
  }

  private filterGames(): void {
    this.wonGames$ = this.gameList$.pipe(
      map(games => games.filter(game => game.status === 'Win'))
    );

    this.lostGames$ = this.gameList$.pipe(
      map(games => games.filter(game => game.status === 'Loss'))
    );

    this.unfinishedGames$ = this.gameList$.pipe(
      map(games => games.filter(game => game.status === 'Unfinished'))
    );
  }
}

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ProfileComponent
  ]
})
export class GameViewModule { }
