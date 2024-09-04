import { Component, OnInit , Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../Service/user.service';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
 
  constructor(
    private _userService: UserService
    , private _authService: AuthService
    , private toaster : ToastrService
    , @Inject(DOCUMENT) private document: Document
  ){}

  ngOnInit() {
    sessionStorage.clear();
    this.loginFormValidation();
  }

  loginFormValidation() {
    this.form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const username = this.form.value.username;
    const password = this.form.value.password;
    this._userService.Login(`User/Login?username=${username}&password=${password}`).subscribe({
      next: (response: any) => {
        if (response.status == "S") {
          sessionStorage.setItem("username", response.data);
          this.toaster.success(response.message);
          this._authService.login();
        } else {
          this.toaster.error(response.message);
        }
      },
      error: (error: any) => {
        this.toaster.error("Something went wrong, please try again later.")
        console.log(error);
      }
    });
  }
}
