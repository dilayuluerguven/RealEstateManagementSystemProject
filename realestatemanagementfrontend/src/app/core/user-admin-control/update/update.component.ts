import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminControlService } from '../admin-control.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {
  formGroup!: FormGroup;
  userId!: number;
  showPassword: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: AdminControlService,
    private router: Router,
    private toastr: ToastrService

  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.formGroup = this.fb.group({
      adSoyad: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sifre: [''],
      rol: ['', Validators.required],
    });

    this.getUserById();
  }

  getUserById() {
  this.userService.getUserById(this.userId).subscribe({
    next: (user) => {
      this.formGroup.patchValue({
        adSoyad: user.adSoyad,
        email: user.email,
        rol: user.rol
      });
    },
    error: () => {
      this.toastr.error('Kullanıcı bilgileri yüklenemedi');
      this.router.navigate(['/core/admin/users']);
    }
  });
}

 update() {
  if (this.formGroup.invalid) {
    this.toastr.warning('Lütfen zorunlu alanları doldurun');
    this.formGroup.markAllAsTouched();
    return;
  }

  const payload = {
    adSoyad: this.formGroup.get('adSoyad')!.value,
    email: this.formGroup.get('email')!.value,
    rol: this.formGroup.get('rol')!.value,
    sifre: this.formGroup.get('sifre')!.value || null
  };

  this.userService.updateUser(payload, this.userId).subscribe({
    next: () => {
      this.toastr.success('Kullanıcı başarıyla güncellendi');
      this.router.navigate(['/core/admin/users']);
    },
    error: (err) => {
      console.error('UPDATE ERROR:', err);
      this.toastr.error(err?.error?.message || 'Güncelleme işlemi başarısız');
    }
  });
}
togglePassword() {
  this.showPassword = !this.showPassword;
}



}
