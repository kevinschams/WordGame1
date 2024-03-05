import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {  
  private _authService: AuthService = inject(AuthService);
  public isLoggedIn: boolean = false;

  ngOnInit(): void {
    // this.isLoggedIn = (this._authService.curUserVal !== null ? true : false);
    this._authService.curUser.subscribe(res => {
      this.isLoggedIn = (res ? true : false);
    });
  }
  
  logout() {    
    this._authService.logout().subscribe();
  }

}
