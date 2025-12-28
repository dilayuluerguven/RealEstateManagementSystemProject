import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminControlService } from '../admin-control.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  formGroup!:FormGroup;
  constructor(private fb:FormBuilder,private userService:AdminControlService,private router:Router) {
    
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
    this.userService.createUser(this.formGroup.value).subscribe(()=>{
      this.router.navigate(['/core/admin/users']);
    })
  }
}
