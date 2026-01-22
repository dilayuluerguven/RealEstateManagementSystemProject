import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: any;
  showPassword = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly toastr: ToastrService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      this.toastr.error('Kullanıcı bilgileri bulunamadı');
      return;
    }

    this.profileForm = this.fb.group({
      adSoyad: [this.currentUser.adSoyad, Validators.required],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      sifre: [''],
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
updateProfile(): void {
  if (this.profileForm.invalid) return;

  const payload: any = {
    ...this.profileForm.value,
    rol: this.currentUser.rol,
  };

  if (!payload.sifre) {
    payload.sifre = null;
  }

  this.userService.updateProfile(payload).subscribe({
    next: (res) => {
      const updatedUser = {
        ...this.currentUser,
        adSoyad: payload.adSoyad,
        email: payload.email,
      };

      this.authService.updateCurrentUser(updatedUser);
      this.currentUser = updatedUser;

      this.toastr.success('Profil güncellendi');
      this.router.navigate(['/core/tasinmaz/list']);
    },
    error: (err) => {
      this.toastr.error(err.error?.message || 'Profil güncellenemedi');
    },
  });
}

}
