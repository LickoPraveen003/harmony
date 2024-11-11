import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordValidator } from '../services/password-validator';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errMsg: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6), passwordValidator]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errMsg = ['Please fill in all required fields correctly.'];
      // this.toastr.error('Please fill in all required fields correctly.', 'Error');
      return;
    }
  
    const { username, password } = this.loginForm.value;
    this.errMsg = [];
    this.userService.login(username, password).subscribe(
      success => {
        if (success) {
          localStorage.setItem('user', JSON.stringify({ username }));
          // this.toastr.success('Login successful!', 'Success');
          this.router.navigate(['/dashboard']);
        } else {
          this.errMsg.push('Invalid username or password');
          // this.toastr.error('Invalid username or password', 'Error');
        }
      },
      error => {
        this.errMsg.push('An error occurred. Please try again later.');
        // this.toastr.error('An error occurred. Please try again later.', 'Error');
      }
    );
  }
  
  
}
