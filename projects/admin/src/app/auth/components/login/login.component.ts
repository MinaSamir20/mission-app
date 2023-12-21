import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}
  hide = true;
  loginForm!: FormGroup;
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      role: ['coordinator'],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.spinner.show();
      this.service.login(this.loginForm.value).subscribe({
        next: (user) => {
          const isAuthenticated = true;
          if (isAuthenticated && user.roles == 'COORDINATOR') {
            this.service.setAuthenticated(true);
            this.toastr.success('Success', 'Login Success');
            // console.log(user);
            this.router.navigate(['/main']);
          }
          this.spinner.hide();
        },
        error: (error) => {
          this.toastr.error(
            'something wrong,\n please check your email and password'
          );
          this.spinner.hide();
        },
      });
    }
  }

  register() {
    this.router.navigate(['/register']);
  }
}
