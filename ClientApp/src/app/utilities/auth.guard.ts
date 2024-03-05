import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Injectable({ 
   providedIn: 'root'
})

export class AuthGuard {

    private _router: Router = inject(Router);
    private _authService: AuthService = inject(AuthService);

    /**
     * Used in the routing module in order to guard certain routes based on certain criteria defined in this method. In
     * this case, the criteria is simply if the User is logged in.
     * 
     * @param route 
     * 
     * @param state 
     * 
     * @returns 
     */
     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this._authService.curUser.subscribe(curUser => {
          if(curUser) {
            
            // authorized so return true
            return true;
          } else {      

            this._router.navigate(['/auth/login']);
            return false;
          }
        });                
    }
    
}
