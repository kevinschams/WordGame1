import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
// import { TestComponent } from './components/test/test.component';

import { AuthGuard } from './utilities/auth.guard';
import { WordgameComponent } from './components/wordgame/wordgame.component';
import { GameViewComponent } from './components/game-view/game-view.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },    
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
    { path: 'wordgame', component: WordgameComponent, canActivate: [AuthGuard]},  
    { path: 'gameview/:id', component: GameViewComponent, canActivate: [AuthGuard]},  
    { path: 'games/:id', component: GameViewComponent, canActivate: [AuthGuard]},  
    { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard]},  
    { path: '**', component: PageNotFoundComponent },
];
