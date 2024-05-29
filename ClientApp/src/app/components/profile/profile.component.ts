import { Component, NgModule, OnInit, inject } from '@angular/core';
import { GameService } from '../../auth/services/gameService';
import { GameDto } from '../../models/gameDto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as Highcharts from 'highcharts'; // Import Highcharts

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private _gameService = inject(GameService);
  public gameList$: Observable<GameDto[]> = this._gameService.currentGame$;

  public wonGames: GameDto[] = [];
  public lostGames: GameDto[] = [];
  public unfinishedGames: GameDto[] = [];

  constructor() {}

  ngOnInit(): void {
    this.getAllGames();
    this.filterGames();
    // this.renderPieChart();
  }

  public getAllGames(): void {
    this._gameService.getAllGames();
  }

  // private filterGames(): void {
  //   this.gameList$.subscribe(games => {
  //     this.wonGames = games.filter(game => game.status === 'Win');
  //     this.lostGames = games.filter(game => game.status === 'Loss');
  //     this.unfinishedGames = games.filter(game => game.status === 'Unfinished');
  //   });
  // }
  private filterGames(): void {
    this.gameList$.subscribe(games => {
      this.wonGames = games.filter(game => game.status === 'Win');
      this.lostGames = games.filter(game => game.status === 'Loss');
      this.unfinishedGames = games.filter(game => game.status === 'Unfinished');
  
      this.renderPieChart(); // Render the chart after data is available
    });
  }



  private renderPieChart(): void {
    Highcharts.chart('pieChartContainer', {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Games Summary'
      },
      series: [{
        type: 'pie',
        name: 'Games',
        data: [
          { name: 'Won', y: this.wonGames.length },
          { name: 'Lost', y: this.lostGames.length },
          { name: 'Unfinished', y: this.unfinishedGames.length }
        ]
      }]
    });
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