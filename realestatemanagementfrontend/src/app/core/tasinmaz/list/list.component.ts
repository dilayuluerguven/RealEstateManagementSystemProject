import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TasinmazService } from '../tasinmaz.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit{
  tasinmazlar:any[]=[];
  constructor(private httpClient:HttpClient,private tasinmazService:TasinmazService){

  }
  ngOnInit(): void {
       this.tasinmazService.getAll().subscribe(res=>{
        console.log('res:',res);
        
      this.tasinmazlar=res;
    })
  }
  

}
