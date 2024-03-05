import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs';
import { EmailLoginDetails } from '../../models/email-login-details';

@Component({
  selector: 'app-register',
  // standalone: true,
  // imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
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
    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    // stop here if form is filled out incorrectly
    if(this.f['password'].value !== this.f['repeatPassword'].value){  
      this.f['repeatPassword'].setErrors({'match':false});
      this.f['password'].setErrors({'match':false});
      
      return;
  }

  // Create an instance of our EmailLoginDetails model to send to the
  // backend server. This EmailLoginDetails object is of the structure the server
  // expects to receive.
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
