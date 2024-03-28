import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs';
import { EmailLoginDetails } from '../../models/email-login-details';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _authService = inject(AuthService);

  public signupForm: FormGroup;
  public loading: boolean = false;
  public submitted: boolean = false;
  public returnUrl: string = "";
  public errors: string[] = [];

  constructor() {
    this.signupForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required]
    });

  }
  ngOnInit(): void {
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.signupForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }

    if(this.f['password'].value !== this.f['repeatPassword'].value){  
      this.f['repeatPassword'].setErrors({'match':false});
      this.f['password'].setErrors({'match':false});
      
      return;
  }


  const credentials: EmailLoginDetails = { 
    email: this.f['username'].value, 
    password: this.f['password'].value
  };

  this.loading = true;
  this._authService.register(credentials)
      .pipe(first())
      .subscribe(
        (data: any) => {                            
            if(!data){                        
                this.loading = false;
                this.signupForm.reset();
            }else{
                this._router.navigate([this.returnUrl]);
            }
              
          },
          (errResp) => {              
              this.errors = errResp.error.errors;
              this.loading = false;
          });

  }
}
