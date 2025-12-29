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

  const payload: any = {
    adSoyad: this.formGroup.value.adSoyad,
    email: this.formGroup.value.email,
    rol: this.formGroup.value.rol
  };

  if (this.formGroup.value.sifre?.trim()) {
    payload.sifre = this.formGroup.value.sifre;
  }

  this.userService.updateUser(payload, this.userId).subscribe({
    next: () => {
      this.toastr.success('Kullanıcı başarıyla güncellendi');
      this.router.navigate(['/core/admin/users']);
    },
    error: () => {
      this.toastr.error('Güncelleme işlemi başarısız');
    }
  });
}

}
