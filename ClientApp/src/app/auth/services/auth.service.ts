import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EmailLoginDetails } from '../models/email-login-details';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _http = inject(HttpClient);
  
  // The key which will be used for localStorage
  private _userKey: string = 'curUser';

  // BehaviorSubject for storing the logged in user
  private _curUserSubject: BehaviorSubject<User | null>;
  // Observable which will emit changes to the logged in user to the application
  public curUser: Observable<User | null>;

  constructor() {
    // Attempt to get the user from localStorage 
    const curUserJsonRaw = localStorage.getItem(this._userKey);
    // If no user is logged in currently, then localStorage will have given us back null
    const curUserJson = (null !== curUserJsonRaw ? JSON.parse(curUserJsonRaw) : null);

    // Place the result from gathering the user from localStorage into the BehaviorSubject.
    // This will be a user object if there is a logged in user; it will be null otherwise.
    this._curUserSubject = new BehaviorSubject<User | null>(curUserJson);
    // Emit the logged in user to the Observable so that the application can see changes in the
    // state of the user as the user performs login and logout actions.
    this.curUser = this._curUserSubject.asObservable();
  }

  // Convenient way to get the user value directly.
  public get curUserVal(): User | null{
    return this._curUserSubject.value;
  }

  public register(details: EmailLoginDetails): Observable<User>{
    console.log(details);
    return this._http.post<User>(`/api/auth/register`, details)
            .pipe(tap(user => {
              // console.log(user + "!!!!");
              return user;
            }));
            
  }

  public login(details: EmailLoginDetails): Observable<User> {    
    return this._http.post<User>(`/api/auth/login`, details)
            .pipe(tap(user => {
              localStorage.setItem(this._userKey, JSON.stringify(user));
              this._curUserSubject.next(user);
              
              return user;
            }));
  }
  
  public logout(): Observable<any> {
    return this._http.post<any>(`/api/auth/logout`, {})
            .pipe(tap(() => {
              // Remove the user from local storage
              localStorage.removeItem(this._userKey);
              // Remove the user from the BehaviorSubject
              this._curUserSubject.next(null);
            }));
  }

}
