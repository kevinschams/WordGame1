import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/models/user';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable, of } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  
  private _authService: AuthService = inject(AuthService);
  public user: Observable<User | null> = of(null);
  public isLoggedIn: boolean = false;
  // public user: User | null = null;

  ngOnInit(): void {
    // this.user = this._authService.curUserVal;
    this.user = this._authService.curUser;
    this._authService.curUser.subscribe(res => {
      this.isLoggedIn = (res ? true : false);
    });
  }

}
