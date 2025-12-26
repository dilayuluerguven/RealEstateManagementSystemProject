import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  formGroup=new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',[Validators.required])
  })
 

  constructor(private authService:AuthService,private router:Router){
 
  }
  ngOnInit():void{

  }
  show()
  {
    if(this.formGroup.invalid)
    {
      return;
    }
    const email = this.formGroup.value.email ;
    const password = this.formGroup.value.password;
    this.authService.login(email as string,password as string).subscribe(x=>{
      localStorage.setItem('token',x.token);
      console.log(x);
      this.router.navigate(['/core/tasinmaz/list']);

    })
  }

}
