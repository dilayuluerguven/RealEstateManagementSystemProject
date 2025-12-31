import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminControlService } from '../admin-control.service';
import { Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  formGroup!:FormGroup;
  showPassword: boolean = false;
  constructor(private fb:FormBuilder,private userService:AdminControlService,private router:Router,private toastr:ToastrService) {
    
  }
  ngOnInit(): void {
      this.formGroup=this.fb.group({
        adSoyad:['',[Validators.required]],
        email:['',[Validators.required,Validators.email]],
        sifre:['',[Validators.required,Validators.minLength(8),Validators.maxLength(12),Validators.pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,12}$/
    ),]],
        rol:['',Validators.required]
      });
  }
  save() {
  if (this.formGroup.invalid) {
    this.formGroup.markAllAsTouched();
    this.toastr.warning('Lütfen zorunlu alanları doğru doldurun');
    return;
  }

  this.userService.createUser(this.formGroup.value).subscribe({
    next: () => {
      this.toastr.success('Kullanıcı başarıyla kaydedildi');
      this.router.navigate(['/core/admin/users']);
    },
    error: (err) => {
      if (err.error?.errors) {
        Object.values(err.error.errors).forEach((messages: any) => {
          messages.forEach((msg: string) => {
            this.toastr.error(msg);
          });
        });
      } else {
        this.toastr.error('Kullanıcı kaydedilemedi');
      }
    },
  });
}
togglePassword() {
  this.showPassword = !this.showPassword;
}

}
