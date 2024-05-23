import { Component, NgModule, OnInit, inject } from '@angular/core';
import { GameService } from '../../auth/services/gameService';
import { GameDto } from '../../models/gameDto';
import { Observable, map } from 'rxjs';
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
  public gameList$: Observable<GameDto[] | []> = this._gameService.currentGame$;
  
  public getAllGames(): void{
    this._gameService.getAllGames();
  }
  ngOnInit(): void {
    this.getAllGames();
  }

  getNumberOfGames(){
    this._gameService.getAllGames.length;
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
