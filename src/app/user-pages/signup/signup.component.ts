import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../Service/user.service';
import { Router } from '@angular/router';
import { validationPatterns } from '../../../constants/app.constants';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],  // Fixed typo: styleUrl -> styleUrls
  providers: [UserService]
})

export class SignupComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private _userService: UserService
    , private router: Router
  ) {}

  ngOnInit(): void {
    this.userFormValidation();
  };

  userFormValidation(){
    this.form = new FormGroup({
      firstname: new FormControl('', 
        [
          Validators.required
          , Validators.pattern(validationPatterns.alpha)
        ]
      ),
      lastname: new FormControl('', 
        [
          Validators.required
          , Validators.pattern(validationPatterns.alpha)
        ]),
      emailid: new FormControl('', 
        [
          Validators.required
          , Validators.email
        ]),
      mobilenumber: new FormControl('', 
        [
          Validators.required
          , Validators.maxLength(10)
          , Validators.minLength(10)
          , Validators.pattern(validationPatterns.numeric)
        ]),
      password: new FormControl('', 
        [
          Validators.required
          , Validators.maxLength(12)
          , Validators.minLength(6)
        ])
    });
  };

  addUpdateUser() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userData = this.form.value;
    this._userService.AddUpdateUser(userData, "User/AddUpdateUser").subscribe({
      next: (res: any) => {
        this.router.navigate(['login']);
      },
      error: (error: any) => {
        console.error('Error fetching user list:', error);
      },
      complete: () => {
        console.log('User list fetch complete');
      }
    });
  };

}
