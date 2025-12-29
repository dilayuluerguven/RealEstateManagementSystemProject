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
  constructor(private fb:FormBuilder,private userService:AdminControlService,private router:Router,private toastr:ToastrService) {
    
  }
  ngOnInit(): void {
      this.formGroup=this.fb.group({
        adSoyad:['',[Validators.required]],
        email:['',[Validators.required,Validators.email]],
        sifre:['',Validators.required],
        rol:['Admin',Validators.required]
      });
  }
  save(){
    if(this.formGroup.invalid) return;
    this.userService.createUser(this.formGroup.value).subscribe({
      next:()=>{
        this.router.navigate(['/core/admin/users']);
        this.toastr.success("Kullanıcı başarıyla kaydedildi.")
      },
      error:(err)=>{
        this.toastr.warning("Kullanıcı kaydedilmedi.")
      }
    })
  }
}
