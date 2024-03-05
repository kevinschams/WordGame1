import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TestComponent } from './components/test/test.component';
import { AuthGuard } from './utilities/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },    
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
    { path: 'test', component: TestComponent, canActivate: [AuthGuard]},    

    { path: '**', component: PageNotFoundComponent },
];
