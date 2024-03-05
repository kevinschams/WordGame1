import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private _authService: AuthService = inject(AuthService);
    private _router: Router = inject(Router);    

    /**************************************************************
        NOTE: This Interceptor is currently **NOT ACTIVE** in this 
                app in order to allow for 400 and 500 level error
                messages to be seen and addressed by the Angular
                in relevant places. To activate this interceptor
                in this app again, go to the src/app/app.config.ts
                and see the comment there to uncomment this
                AuthInterceptor's element in the providers array.
    
    ****************************************************************/
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(err => {
                if (err.status >= 400 && err.status < 500) {
                  this._authService.logout();
                  this._router.navigate(['/login']);

                }
                return throwError(err);
            })
        );
    }
}
