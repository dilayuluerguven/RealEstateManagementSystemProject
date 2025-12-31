import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  formGroup = new FormGroup(
    {
      adSoyad: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(12),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,12}$/),
      ]),
      confirmPassword: new FormControl('', Validators.required),
    },
    { validators: this.passwordMatch }
  );
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {}
  passwordMatch(group: AbstractControl) {
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { notMatch: true };
  }
  register() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { adSoyad, email, password } = this.formGroup.value;

    this.authService.register(adSoyad!, email!, password!, 'User').subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Kayıt başarılı');
        this.formGroup.reset();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        console.log('REGISTER ERROR:', err);
        this.toastr.error(
          err?.error?.message || JSON.stringify(err?.error) || 'Kayıt alınamadı'
        );
      },
    });
  }
}
