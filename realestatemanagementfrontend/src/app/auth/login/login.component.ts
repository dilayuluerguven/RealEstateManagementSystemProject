import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  loading = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {}
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  show() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.toastr.warning('Lütfen email ve şifreyi giriniz');
      return;
    }

    this.loading = true;

    const { email, password } = this.formGroup.value;

    this.authService.login(email!, password!).subscribe({
      next: (x) => {
        this.loading = false;

        localStorage.setItem('token', x.token);
        localStorage.setItem('role', x.rol);
        localStorage.setItem('userId', x.id.toString());
        localStorage.setItem('userName', x.adSoyad);

        if (x.rol === 'Admin') {
          this.router.navigate(['/core/admin']);
          this.toastr.success('Admin girişi başarılı');
        } else {
          this.router.navigate(['/core/tasinmaz/list']);
          this.toastr.success('Giriş başarılı');
        }
      },

      error: (err) => {
        this.loading = false;

        if (err.status === 401 || err.status === 400) {
          this.toastr.error('Email veya şifre hatalı');
          this.formGroup.get('password')?.reset();
        } else {
          this.toastr.error('Giriş yapılamadı');
        }
      },
    });
  }
}
